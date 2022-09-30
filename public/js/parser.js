const submit_button = document.getElementById('submit_button').addEventListener('click', () => {
    console.log("Button click");
    product_id = document.getElementById('product_id').value;
    product_name = document.getElementById('product_name').value;

    Papa.parse(document.getElementById('product_csv').files[0], {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(input_file) {
            const cena_position = input_file.meta.fields.indexOf('Cena');
            const attrib_names = input_file.meta.fields.slice(0, cena_position);
            console.log('Cena found on postion: ' + cena_position);
            let attrib_values = [];
            attrib_names.forEach(attrib_name => {
                    console.log(attrib_name);
                    let name_index = attrib_names.indexOf(attrib_name);
                    if (typeof attrib_values[name_index] === 'undefined') {
                        attrib_values.push([]);
                    }
                    input_file.data.forEach(row => {
                        if (!attrib_values[name_index].includes(row[attrib_name])) {
                            attrib_values[name_index].push(row[attrib_name]);
                        }
                    })
                })
                // const attrib_arr = [
                //     attrib_names,
                //     attrib_values
                // ]
            console.log(attrib_names);
            console.log(attrib_values);
            console.log(input_file);

            let output_arr = [
                ["ID", "Typ", "Nazwa", "Element nadrzędny", "Cena"]
            ]

            attrib_names.forEach(name => {
                index = attrib_names.indexOf(name);
                col_name = 'Nazwa atrybutu ' + (index + 1);
                output_arr[0].push(col_name);
                col_value = 'Wartości atrybutu ' + (index + 1);
                output_arr[0].push(col_value);
            })

            output_arr.push([product_id, 'variable', product_name, '', '']);
            attrib_names.forEach(attrib_name => {
                index = attrib_names.indexOf(attrib_name);
                output_arr[1].push(attrib_name);
                output_arr[1].push(attrib_values[index].join(', '));
            })

            input_file.data.forEach(row => {
                variation = ['', 'variation', product_name, 'id:' + product_id, row['Cena']];
                attrib_names.forEach(attrib_name => {
                    variation.push(attrib_name);
                    variation.push(row[attrib_name]);
                })
                output_arr.push(variation);
            })
            output_csv = Papa.unparse(output_arr, {
                quotes: true,
                quoteChar: '"',
                escapeChar: '"',
                delimiter: ",",
                header: true,
                newline: "\r\n",
                skipEmptyLines: false,
                columns: null

            })

            // document.getElementById("viewer").textContent = output_csv;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/save-result");

            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => console.log(xhr.responseText);

            let data = {
                file_name: product_id.replace(/\s/g, '_') + "_" + product_name.toLowerCase().replace(/\s/g, '_') + "_" + Date.now() + '.csv',
                product_csv: output_csv
            }

            xhr.send(JSON.stringify(data));

            var a = document.getElementById('download_result');
            a.href = '/results/' + data.file_name;
            a.download = data.file_name;
            a.style = "display: inline-block;"
            a.click();


        }
    })
})