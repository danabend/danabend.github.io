var dataset = {};
/*
Applicant or Qualifier Person Title: "APPLICANT"
Applicant or Qualifier of Person: "PITCOCK, THERESA"
Business Mailing Address Line 01: "AATN: THERESE PITCOCK, GEN ACC"
Business Mailing Address Line 02: "6600 AAA DRIVE"
Business Mailing City: "CHARLOTTE"
Business Mailing State: "NC"
Business Mailing Zip Code: "28212"
Business Name Short: "A A A CAR CARE CENTERS LLC"
Business Opened Date: "09/08/2007"
License Classification Description: "AUTO GARAGE"
License Fiscal Year: "2016"
License Number: "26678"
License Status: "AC"
Location Address: "924 N  PLEASANTBURG DR"
*/

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

  document.getElementById('search').onclick = function() {
    var businessName = document.getElementById('business-name').innerText.toUpperCase();
    var personName = document.getElementById('person').innerText.toUpperCase();
    var address = document.getElementById('address').innerText.toUpperCase();
    var category = document.getElementById('category').innerText.toUpperCase();
    
    var results = {};
    dataset.forEach( function(row) {
      if(businessName && row['Business Name Short'] && row['Business Name Short'].indexOf(businessName) > -1) {
        results.push(row);
        continue;
      }
      if(personName && row['Applicant or Qualifier of Person'] && row['Applicant or Qualifier of Person'].indexOf(personName) > -1) {
        results.push(row);
        continue;        
      }
      if(address) {
        if(row['Location Address'] && row['Location Address'].indexOf(address) > -1) {
          results.push(row);
          continue;
        }
        if(row['Business Mailing Address Line 01'] && row['Business Mailing Address Line 01'].indexOf(address) > -1) {
          results.push(row);
          continue;
        } 
      }
      if(category && row['License Classification Description'] && row['License Classification Description'].indexOf(category) > -1) {
        results.push(row);
        continue;        
      }
    })

    document.getElementById('result').innerText = '<ul><li>' + results.join('</li><li>') + '</li></ul>';
  }
};

function search() {

}