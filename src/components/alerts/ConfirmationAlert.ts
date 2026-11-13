import Swal from "sweetalert2";

export async function showCloseGroupConfirmation(): Promise<boolean> {
  const result = await Swal.fire({
    title: "Fechar grupo?",
    text: "Depois de fechado, não será possível adicionar ou alterar informações deste grupo.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Fechar grupo",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    confirmButtonColor: "#ff0d51",
    cancelButtonColor: "#7a8c89",
  });

  return result.isConfirmed;
}
