import swal from 'sweetalert2';
import type { SweetAlertOptions } from 'sweetalert2';

export type SweetAlertInstance = ReturnType<typeof swal.mixin>;

export class Layer {
  public swalInstance: SweetAlertInstance;
  public loadingInstance: SweetAlertInstance;

  constructor() {
    this.swalInstance = swal.mixin({
      title: '',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      width: '26rem',
      reverseButtons: true,
    });

    this.loadingInstance = swal.mixin({
      showCancelButton: false,
      showConfirmButton: false,
      iconColor: 'transparent',
      background: 'transparent',
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      iconHtml: `
        <div  class="lu-loading--wave">
          <div class="lu-loading--wave__child"></div>
          <div class="lu-loading--wave__child"></div>
          <div class="lu-loading--wave__child"></div>
          <div class="lu-loading--wave__child"></div>
          <div class="lu-loading--wave__child"></div>
        </div>
      `,
    });
  }

  confirm(text: string, opts?: SweetAlertOptions) {
    return this.swalInstance.fire({
      icon: 'question',
      showCancelButton: true,
      text,
      ...(opts || {}),
    });
  }

  toast(title: string, opts?: SweetAlertOptions) {
    return this.swalInstance.fire({
      icon: 'success',
      position: 'top-end',
      title,
      showConfirmButton: false,
      timer: 2500,
      toast: true,
      ...(opts || {}),
    });
  }

  showLoading() {
    this.loadingInstance.fire();
  }

  closeLoading() {
    this.loadingInstance.close()
  }
};

const $layer = new Layer();

export default $layer;
