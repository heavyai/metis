open Ast;

let jTest = "{\"type\":\"data\",\"source\":\"flights\",\"name\":\"test\",\"transform\":[]}";

let failTransform (id: int) (msg: string) :string =>
  "Expected transform[" ^ string_of_int id ^ "] " ^ msg;

let extractString (d: Js.Dict.t 'a) (prop: string) (failMsg: string => string) :Js_string.t =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.String, s) => s
    | _ => failwith (failMsg ("`" ^ prop ^ "` to be a String"))
    }
  | None => failwith (failMsg ("to have property: " ^ prop))
  };

let extractStringOption (d: Js.Dict.t 'a) (prop: string) :option Js_string.t =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.String, s) => Some s
    | _ => None
    }
  | None => None
  };

let extractNumber (d: Js.Dict.t 'a) (prop: string) (failMsg: string => string) :float =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.Number, s) => s
    | _ => failwith (failMsg ("`" ^ prop ^ "` to be a Number"))
    }
  | None => failwith (failMsg ("to have property: " ^ prop))
  };

let extractNumberOption (d: Js.Dict.t 'a) (prop: string) :option float =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.Number, s) => Some s
    | _ => None
    }
  | None => None
  };

let extractBoolOption (d: Js.Dict.t 'a) (prop: string) :option bool =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.Boolean, b) => Some (Js.to_bool b)
    | _ => None
    }
  | None => None
  };

let extractStringNumberOp (d: Js.Dict.t 'a) (prop: string) :option constOrCol =>
  switch (extractStringOption d prop) {
  | Some s => Some (Id s)
  | None =>
    switch (extractNumberOption d prop) {
    | Some f => Some (Float f)
    | None => None
    }
  };

let extractArray (d: Js.Dict.t 'a) (prop: string) (failMsg: string => string) :array 't =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.Array, s) => s
    | _ => failwith (failMsg ("`" ^ prop ^ "` to be an Array"))
    }
  | None => failwith (failMsg ("to have property: " ^ prop))
  };

let extractObject (d: Js.Dict.t 'a) (prop: string) (failMsg: string => string) :Js.Dict.t 't =>
  switch (Js.Dict.get d prop) {
  | Some v =>
    switch (Js.Json.reifyType v) {
    | (Js.Json.Object, s) => s
    | _ => failwith (failMsg ("`" ^ prop ^ "` to be a Object"))
    }
  | None => failwith (failMsg ("to have property: " ^ prop))
  };

/* let jsonTstr (j: Js.Json.kind 't) :string =>
     switch j {
     | Js.Json.Object => "Object"
     | Js.Json.Number => "Number"
     | Js.Json.String => "String"
     | Js.Json.Array => "Array"
     | Js.Json.Boolean => "Boolean"
     | Js.Json.Null => "null"
     };

   let extractFromObj
       (d: Js.Dict.t 'a)
       (t: Js.Json.kind 'b)
       (prop: string)
       (failMsg: string => string)
       :'t =>
     switch (Js.Dict.get d prop) {
     | Some v =>
       switch (Js.Json.reifyType v) {
       | (jsontyp, s) =>
         jsontyp == t ? s : failwith (failMsg ("`" ^ prop ^ "` to have type: " ^ jsonTstr t))
       }
     | None => failwith (failMsg ("to have property: " ^ prop))
     };

   let extractFromObjOption
       (d: Js.Dict.t 'a)
       (t: Js.Json.kind 'b)
       (prop: string)
       (failMsg: string => string)
       :'t =>
     switch (Js.Dict.get d prop) {
     | Some v =>
       switch (Js.Json.reifyType v) {
       | (jsontyp, s) => jsontyp == t ? Some s : None
       }
     | None => None
     }; */
let parseBin ((id, bin): (int, Js.Dict.t 'a)) :transform => {
  let f = extractString bin "field" (failTransform id);
  let ext = extractArray bin "extent" (failTransform id);
  let maxBins = extractNumber bin "maxbins" (failTransform id);
  let a = extractString bin "as" (failTransform id);
  let (mm, mm') =
    switch (Js.Json.reifyType ext.(0), Js.Json.reifyType ext.(1)) {
    | ((Js.Json.Number, mm), (Js.Json.Number, mm')) => (mm, mm')
    | _ => failwith (failTransform id "`extent` to be an Array<int> with length 2")
    };
  Bin f (MinMax (Float mm, Float mm')) (int_of_float maxBins) a
};

let parseCSort ((id, csort): (int, Js.Dict.t 'a)) :collect => {
  let s = extractObject csort "sort" (failTransform id);
  let sfield = extractString s "field" (failTransform id);
  let ord = extractStringOption s "order";
  let ord' =
    switch ord {
    | Some "ascending" => Some ASC
    | Some "descending" => Some DESC
    | Some v =>
      failwith (failTransform id ("`order.order` to be one of ascending | descending, got: " ^ v))
    | _ => None
    };
  CSort sfield ord'
};

let parseCLimit ((id, clim): (int, Js.Dict.t 'a)) :collect => {
  let lim = extractObject clim "limit" (failTransform id);
  let sLim = extractNumber lim "row" (failTransform id);
  let sOff = extractNumberOption lim "offset";
  let sOff' =
    switch sOff {
    | Some n => Some (int_of_float n)
    | None => None
    };
  CLimit (int_of_float sLim) sOff'
};

let extractfId (d: Js.Dict.t 'a) (failMsg: string => string) :fId => {
  let idS = extractStringOption d "id";
  let idN = extractNumberOption d "id";
  switch (idS, idN) {
  | (Some s, None) => String s
  | (None, Some n) => Int (int_of_float n)
  | (_, _) => failwith (failMsg "to have property id of String | Number")
  }
};

let parseFilterExpression ((id, fexp): (int, Js.Dict.t 'a)) :filter => {
  let fid = extractfId fexp (failTransform id);
  let exp = extractString fexp "expr" (failTransform id);
  FExpression fid (ExprSTR exp)
};

let reiFyString (t: Js.Json.t) (failMsg: string => string) :string =>
  switch (Js.Json.reifyType t) {
  | (Js.Json.String, str) => str
  | _ => failwith (failMsg "to have property equals for type String | Number | Array")
  };

let reiFyNumber (t: Js.Json.t) (failMsg: string => string) :float =>
  switch (Js.Json.reifyType t) {
  | (Js.Json.Number, n) => n
  | _ => failwith (failMsg "to have property equals for type String | Number | Array")
  };

let parseFeq (f: Js.Dict.t 'a) (failMsg: string => string) :fEquals =>
  switch (Js.Dict.get f "equals") {
  | Some s =>
    let rec decodeFeq (s: Js.Json.t) :fEquals =>
      switch (Js.Json.decodeString s) {
      | Some str => (String str: fEquals)
      | None =>
        switch (Js.Json.decodeNumber s) {
        | Some n => (Float n: fEquals)
        | None =>
          switch (Js.Json.decodeArray s) {
          | Some s => List (Array.to_list (Array.map decodeFeq s))
          | None => failwith (failMsg "to have property equals for type String | Number | Array")
          }
        }
      };
    decodeFeq s
  | None => failwith (failMsg "to have property equals")
  };

let parseFilterExact ((id, fexp): (int, Js.Dict.t 'a)) :filter => {
  let fid = extractfId fexp (failTransform id);
  let field = extractString fexp "field" (failTransform id);
  let feq = parseFeq fexp (failTransform id);
  FExact fid (Id field) feq
};

let parseFilterRange ((id, fexp): (int, Js.Dict.t 'a)) :filter => {
  let fid = extractfId fexp (failTransform id);
  let field = extractString fexp "field" (failTransform id);
  let range = extractArray fexp "range" (failTransform id);
  let range' =
    switch (Array.map Js.Json.decodeString range) {
    | [|Some s, Some s'|] => (MinMax (Id s, Id s'): minMax constOrCol)
    | _ =>
      switch (Array.map Js.Json.decodeNumber range) {
      | [|Some n, Some n'|] => (MinMax (Float n, Float n'): minMax constOrCol)
      | _ => failwith (failTransform id "`range` to be an Array<Number|String> with length 2")
      }
    };
  FRange fid (Id field) range'
};

let rec parsefOpExp (f: Js.Json.t) (failMsg: string => string) :fOperationExp => {
  let parsefExpT (e: Js.Json.t) :fExpType =>
    switch (Js.Json.reifyType e) {
    | (Js.Json.Object, o) =>
      let typ = extractString o "type" failMsg;
      let left =
        switch (extractStringNumberOp o "left") {
        | Some v => v
        | None => failwith (failMsg "`filters` to be valid.")
        };
      let right =
        switch (extractStringNumberOp o "right") {
        | Some v => v
        | None => failwith (failMsg "`filters` to be valid.")
        };
      switch typ {
      | "=" => FEqual left right
      | "<>" => FNotEqual left right
      | "<" => FLessThan left right
      | ">" => FGreaterThan left right
      | "<=" => FLessThanEq left right
      | ">=" => FGreaterThanEq left right
      | "ilike" => FIlike left right
      | "like" => FLike left right
      | "between" => FBetween left right
      | _ => failwith (failMsg "to have a valid filter type, got: " ^ typ)
      }
    | _ => failwith (failMsg "`filters` to be an object or array")
    };
  let parseNotExp (e: Js.Json.t) :option bool =>
    switch (Js.Json.reifyType e) {
    | (Js.Json.Object, o) => extractBoolOption o "not"
    | _ => failwith (failMsg "to be a valid filter operation expression")
    };
  switch (Js.Json.decodeArray f) {
  | Some a => FOperationExpList (Array.to_list (Array.map (fun x => parsefOpExp x failMsg) a))
  | _ => FOperationExp (parsefExpT f) (parseNotExp f)
  }
};

let parseFilterOperation ((id, fexp): (int, Js.Dict.t 'a)) :filter => {
  let fid = extractfId fexp (failTransform id);
  let fops =
    switch (Js.Dict.get fexp "filters") {
    | Some fops => parsefOpExp fops (failTransform id)
    | None => failwith (failTransform id "to have property `filters`")
    };
  FOperation fid fops
};

let parseSample ((id, samp): (int, Js.Dict.t 'a)) :sample => {
  let size = extractNumber samp "size" (failTransform id);
  let lim = extractNumber samp "limit" (failTransform id);
  SMultiplicative (Float size) (Float lim)
};

let parseCrossfilter ((id, cf): (int, Js.Dict.t 'a)) :(string, list filter) => {
  let signal = extractString cf "signal" (failTransform id);
  let filters = extractArray cf "filters" (failTransform id);
  Crossfilter signal filters
};

/* switch (Js.Dict.get bin "field") {
   | Some f =>
     switch (Js.Json.reifyType f) {
     | (Js.Json.String, f) =>
       switch (Js.Dict.get bin "extent") {
       | Some e =>
         switch (Js.Json.reifyType e) {
         | (Js.Json.Array, a) =>
           switch (Js.Json.reifyType a.(0), Js.Json.reifyType a.(1)) {
           | ((Js.Json.Number, mm), (Js.Json.Number, mm')) =>
             switch (Js.Dict.get bin "maxbins") {
             | Some n =>
               switch (Js.Json.reifyType n) {
               | (Js.Json.Number, n) =>
                 switch (Js.Dict.get bin "as") {
                 | Some a =>
                   switch (Js.Json.reifyType a) {
                   | (Js.Json.String, a) => Bin f (MinMax (Float mm, Float mm')) (int_of_float n) a
                   | _ => failwith (failTransform id "`as` to be a string")
                   }
                 | None => failwith (failTransform id "to have property as")
                 }
               | _ => failwith (failTransform id "`maxbin` to be a number")
               }
             | None => failwith (failTransform id "to have property maxbin")
             }
           | _ => failwith (failTransform id "`extent` to be an Array<int> with length 2")
           }
         | _ => failwith (failTransform id "`extent` to be an Array")
         }
       | None => failwith (failTransform id "to have property `extent`")
       }
     | _ => failwith (failTransform id "`field` to be a string")
     }
   | None => failwith (failTransform id "to have property `field`")
   }; */
let parseTransform (id: int) (t: Js.Json.t) :transform =>
  switch (Js.Json.reifyType t) {
  | (Js.Json.Object, tValue) =>
    switch (Js.Dict.get tValue "type") {
    | Some v =>
      switch (Js.Json.reifyType v) {
      | (Js.Json.String, typ) =>
        switch typ {
        | "aggregate" => Aggregate (AVG (Id "arrtime"))
        | "bin" => parseBin (id, tValue)
        | "collect.sort" => Collect (parseCSort (id, tValue))
        | "collect.limit" => Collect (parseCLimit (id, tValue))
        | "filter" => Filter (parseFilterExpression (id, tValue))
        | "filter.exact" => Filter (parseFilterExact (id, tValue))
        | "filter.range" => Filter (parseFilterRange (id, tValue))
        | "filter.operation" => Filter (parseFilterOperation (id, tValue))
        /* | "formula" => Aggregate (AVG (Id "arrtime")) */
        | "sample" => Sample (parseSample (id, tValue))
        | "crossfilter" => Crossfilter (parseCrossfilter (id, tValue))
        | "resolvefilter" => Aggregate (AVG (Id "arrtime"))
        | _ => failwith (failTransform id ("`type` to be a valid transform, encountered: " ^ typ))
        }
      | _ => failwith (failTransform id "`type` to be a string")
      }
    | _ => failwith (failTransform id "to have property `type`")
    }
  | _ => failwith (failTransform id "to be an object")
  };

let parseTransforms (ts: array Js.Json.t) :option (list transform) =>
  switch (Array.length ts) {
  | 0 => None
  | _ => Some (Array.to_list (Array.mapi parseTransform ts))
  };

let parseSql (s: string) :sql => {
  let json =
    try (Js.Json.parseExn s) {
    | _ => failwith "Error parsing JSON string"
    };
  switch (Js.Json.reifyType json) {
  | (Js.Json.Object, value) =>
    switch (Js.Dict.get value "source") {
    | Some datum =>
      switch (Js.Json.reifyType datum) {
      | (Js.Json.String, datumSource) =>
        switch (Js.Dict.get value "transform") {
        | Some t =>
          switch (Js.Json.reifyType t) {
          | (Js.Json.Array, ta) => SQL datumSource (parseTransforms ta)
          | _ => failwith "Expected an `transform` to be an array"
          }
        | None => failwith "Expected a `transform` property"
        }
      | _ => failwith "Expected `source` to be a string"
      }
    | None => failwith "Expected a `source` property"
    }
  | _ => failwith "Expected an object"
  }
};
