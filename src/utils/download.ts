class Download {
  /**
   * 下载文件
   * @param exportData 
   * @param exportName 
   * @param suffix 
   */
  download(exportData: Object | string, exportName: string, suffix = 'txt'){
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(typeof exportData === 'string' ? exportData : JSON.stringify(exportData))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${exportName}.${suffix}`);
    // required for firefox
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  /**
   * 通用下载文件，没有1M下载限制
   * @param exportData 
   * @param fileName 
   * @param suffix 
   */
  downloadNoLimit(exportData: Object | string, fileName: string, suffix = 'txt') {
    let type = '';
    switch (suffix) {
      case 'txt':
        type = '"text/plain"';
        break;
      default:
        type = '"text/json"';
    }
    const blob = new Blob([typeof exportData === 'string' ? exportData: JSON.stringify(exportData)], { type });
    const link = document.createElement("a");

    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = [type, link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
  }
}

const download = new Download();

export default download;