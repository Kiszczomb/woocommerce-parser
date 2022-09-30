const data_form = document.getElementById("upload_form");
const input_file = document.getElementById("product_csv");

function csv2arr(str, delimiter = ";") {
    let arr = new Array;
    let index = 0;
    const rows = str.split("\n");
    rows.forEach(row => {
        arr[index] = new Array;
        const elems = row.split(delimiter);
        elems.forEach(elem => {
            arr[index].push(elem);
        });
        index += 1;
    });
    return arr;
}

function get_attribs(input_arr) {
    let attrib_arr = new Array;
    let attrib_num = 0;
    for (col of input_arr[0]) {
        if (col == "Cena") {
            break;
        };
        attrib_num += 1;
        attrib_arr.push([col, ""]);
    }
    console.log('attrib_arr : ' + JSON.stringify(attrib_arr));
    console.log('input_arr  : ' + JSON.stringify(input_arr));

    console.log('attrib_num : ' + attrib_num);
    for (let i = 0; i < attrib_num; i++) {
        for (row of input_arr) {
            console.log('i = ' + i + '-' + row[i]);
        }
    }
}


data_form.addEventListener("submit", (submit_event) => {
    submit_event.preventDefault();
    console.log("Form submitted");
    const input = input_file.files[0];
    const reader = new FileReader();

    reader.onload = (submit_event) => {
        const text = submit_event.target.result;
        let input_arr = csv2arr(text);
        document.getElementById("viewer").textContent = JSON.stringify(input_arr);
        get_attribs(input_arr);
    };

    reader.readAsText(input);

    let output_arr = [
        ["ID", "Typ", "Nazwa", "Element nadrzędny", "Cena"]
    ]

    let attrib_arr = []
});