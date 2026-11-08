"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import type { ActionResultProps } from "@/types/actionResultProps";
import { errorMessage } from "@/utils/functions/errorMessageFunction";

function pdfText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function createPdf(lines: string[]): string {
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(lines.length / 42)) },
    (_, index) => lines.slice(index * 42, index * 42 + 42),
  );
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const pageIds: number[] = [];
  for (const pageLines of pages) {
    const content = [
      "BT",
      "/F1 11 Tf",
      "50 790 Td",
      ...pageLines.flatMap((line, index) => [
        `(${pdfText(line)}) Tj`,
        index === pageLines.length - 1 ? "" : "0 -17 Td",
      ]),
      "ET",
    ].join("\n");
    const contentId = objects.length + 1;
    objects.push(
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );
    const pageId = objects.length + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  }
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "binary").toString("base64");
}

export async function getGroupReportPdf(
  groupId: string,
): Promise<ActionResultProps<{ fileName: string; contentBase64: string }>> {
  try {
    await AuthUserGroupMember(groupId);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        expenses: { include: { payer: true }, orderBy: { occurredAt: "asc" } },
        settlements: {
          include: { fromMember: true, toMember: true },
          orderBy: { settledAt: "asc" },
        },
      },
    });
    if (!group) return { success: false, formError: "Grupo não encontrado." };
    const lines = [
      "SPLITUP - RELATORIO DO GRUPO",
      `Grupo: ${group.name}`,
      "",
      "DESPESAS",
      "Descricao | Pagador | Valor | Data",
      ...group.expenses.map(
        (expense) =>
          `${expense.description} | ${expense.payer.name ?? expense.payer.email ?? "Membro"} | R$ ${(expense.amountCents / 100).toFixed(2)} | ${expense.occurredAt.toLocaleDateString("pt-BR")}`,
      ),
      "",
      "ACERTOS REGISTRADOS",
      "De | Para | Valor | Data",
      ...group.settlements.map(
        (settlement) =>
          `${settlement.fromMember.name ?? settlement.fromMember.email ?? "Membro"} | ${settlement.toMember.name ?? settlement.toMember.email ?? "Membro"} | R$ ${(settlement.amountCents / 100).toFixed(2)} | ${settlement.settledAt.toLocaleDateString("pt-BR")}`,
      ),
    ];
    return {
      success: true,
      data: {
        fileName: `relatorio-${group.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}.pdf`,
        contentBase64: createPdf(lines),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível gerar o relatório."),
    };
  }
}
