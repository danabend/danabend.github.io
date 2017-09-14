var dataset = {};

window.onload = function() {
  document.getElementById('loader').style.display = 'block';

  /* set up XMLHttpRequest */
  var url = "2016ResidentBusinessLicenseList_201612201241106417.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:"binary"});

    /* DO SOMETHING WITH workbook HERE */
    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    /* trim spaces */
    Object.keys(sheet).forEach( function(key) {
      if(sheet[key].w) {
        sheet[key].w = sheet[key].w.trim();
      }
    });
    /* convert to JSON */
    dataset = XLSX.utils.sheet_to_json(sheet, {range: 1});

    document.getElementById('loader').style.display = 'none';    
  }

  oReq.send();
};

function search() {

}