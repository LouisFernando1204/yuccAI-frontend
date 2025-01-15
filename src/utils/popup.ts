import Swal from "sweetalert2";

export const getResponse = async (question: string, subtitleText: string) => {
  console.log(question)
  try {
    await Swal.fire({
      title: "",
      html: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="text-align: center; font-weight: bold; font-size: 1.2rem;">
                ${question}
              </div>
              <div style="text-align: left; font-weight: normal; font-size: 1rem; color: #333; white-space: pre-line;"
                class="animate__animated animate__fadeIn" id="swal-live-subtitle-container">
                ${subtitleText}
              </div>
            </div>
            `,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      customClass: {
        popup: "swal-modal",
        confirmButton: "swal-confirm-button swal-wide-button",
        cancelButton: "swal-cancel-button swal-wide-button",
        actions: "swal-two-buttons",
      },
      buttonsStyling: false,
      position: "bottom",
      showClass: {
        popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `,
      },
      hideClass: {
        popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
