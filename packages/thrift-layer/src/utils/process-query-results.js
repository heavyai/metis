// TDatumEnum global

export default function processQueryResults(
  result,
  options = {
    eliminateNullRows: false,
    returnTiming: false
  }
) {
  const formattedResult = processColumnarResults(
    result.row_set,
    options.eliminateNullRows
  );

  formattedResult.timing = {
    execution_time_ms: result.execution_time_ms,
    total_time_ms: result.total_time_ms
  };

  return options.returnTiming ? formattedResult : formattedResult.results;
}

function processColumnarResults(data, eliminateNullRows) {
  const formattedResult = { fields: [], results: [] };
  const numCols = data.row_desc.length;
  const numRows =
    data.columns[0] !== undefined ? data.columns[0].nulls.length : 0;

  formattedResult.fields = data.row_desc.map(field => {
    return {
      name: field.col_name,
      type: TDatumEnum[field.col_type.type],
      is_array: field.col_type.is_array
    };
  });

  for (let r = 0; r < numRows; r++) {
    if (eliminateNullRows) {
      let rowHasNull = false;
      for (let c = 0; c < numCols; c++) {
        if (data.columns[c].nulls[r]) {
          rowHasNull = true;
          break;
        }
      }
      if (rowHasNull) {
        continue;
      }
    }
    const row = {};
    for (let c = 0; c < numCols; c++) {
      const fieldName = formattedResult.fields[c].name;
      const fieldType = formattedResult.fields[c].type;
      const fieldIsArray = formattedResult.fields[c].is_array;
      const isNull = data.columns[c].nulls[r];
      if (isNull) {
        // row[fieldName] = "NULL";
        row[fieldName] = null;
        continue;
      }
      if (fieldIsArray) {
        row[fieldName] = [];
        const arrayNumElems = data.columns[c].data.arr_col[r].nulls.length;
        for (let e = 0; e < arrayNumElems; e++) {
          if (data.columns[c].data.arr_col[r].nulls[e]) {
            row[fieldName].push("NULL");
            continue;
          }
          switch (fieldType) {
            case "BOOL":
              row[fieldName].push(
                data.columns[c].data.arr_col[r].data.int_col[e] ? true : false
              );
              break;
            case "SMALLINT":
            case "INT":
            case "BIGINT":
              row[fieldName].push(
                data.columns[c].data.arr_col[r].data.int_col[e]
              );
              break;
            case "FLOAT":
            case "DOUBLE":
            case "DECIMAL":
              row[fieldName].push(
                data.columns[c].data.arr_col[r].data.real_col[e]
              );
              break;
            case "STR":
              row[fieldName].push(
                data.columns[c].data.arr_col[r].data.str_col[e]
              );
              break;
            case "TIME":
            case "TIMESTAMP":
            case "DATE":
              row[fieldName].push(
                data.columns[c].data.arr_col[r].data.int_col[e] * 1000
              );
              break;
            default:
              break;
          }
        }
      } else {
        switch (fieldType) {
          case "BOOL":
            row[fieldName] = data.columns[c].data.int_col[r] ? true : false;
            break;
          case "SMALLINT":
          case "INT":
          case "BIGINT":
            row[fieldName] = data.columns[c].data.int_col[r];
            break;
          case "FLOAT":
          case "DOUBLE":
          case "DECIMAL":
            row[fieldName] = data.columns[c].data.real_col[r];
            break;
          case "STR":
            row[fieldName] = data.columns[c].data.str_col[r];
            break;
          case "TIME":
          case "TIMESTAMP":
          case "DATE":
            row[fieldName] = new Date(data.columns[c].data.int_col[r] * 1000);
            break;
          default:
            break;
        }
      }
    }
    formattedResult.results.push(row);
  }
  return formattedResult;
}
