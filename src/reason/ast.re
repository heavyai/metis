type id = string;

type expr =
  | ExprSTR string;

type number =
  | Int int
  | Float float;

type constOrCol =
  | Id id
  | Int int
  | Float float
  | Str string;

type agg =
  | AVG constOrCol
  | COUNT constOrCol
  | MIN constOrCol
  | MAX constOrCol
  | SUM constOrCol;

type extract =
  | EYear id
  | EQuarter id
  | EMonth id
  | EDom id
  | EDow id
  | EHour id
  | EMinute id;

type dateTrunc =
  | DTYear id
  | DTQuarter id
  | DTMonth id
  | DTWeek id
  | DTDay id
  | DTHour id;

type sortOrder =
  | ASC
  | DESC;

type fExpType =
  | FEqual constOrCol constOrCol
  | FNotEqual constOrCol constOrCol
  | FGreaterThan constOrCol constOrCol
  | FLessThan constOrCol constOrCol
  | FGreaterThanEq constOrCol constOrCol
  | FLessThanEq constOrCol constOrCol
  | FIlike constOrCol constOrCol
  | FLike constOrCol constOrCol
  | FBetween constOrCol constOrCol;

type minMax 't =
  | MinMax ('t, 't);

type maxBins = int;

type fId =
  | String string
  | Int int;

type fEquals =
  | String string
  | Int int
  | Float float
  | List (list fEquals);

type fOperationExp =
  | FOperationExp fExpType (option bool)
  | FOperationExpList (list fOperationExp);

type filter =
  | FExpression fId expr
  | FExact fId constOrCol fEquals
  | FRange fId constOrCol (minMax constOrCol)
  | FOperation fId fOperationExp;

type collect =
  | CSort id (option sortOrder)
  | CLimit int (option int);

type alias = string;

type formula =
  | FExp string (option alias)
  | FDateTrunc dateTrunc (option alias)
  | FExtract extract (option alias);

type sample =
  | SMultiplicative number number;

type ignoreType =
  | STR string
  | Int int
  | Float float;

/*
 type groupby =
   | STR id
   | Formula formula
   | List groupby;

 type transform =
   | Aggregate (list id) (option agg) (option alias) (option groupby) */
type transform =
  | Aggregate agg
  | Bin id (minMax number) maxBins id
  | Collect collect
  | Filter filter
  | Formula formula
  | Sample sample
  | Crossfilter string (list filter)
  | ResolveFilter string (list ignoreType);

type sql =
  | SQL string (option (list transform));

/* Equality functions */
let numberEql (n: number) (n': number) :bool =>
  switch (n, n') {
  | (Int i, Int i') => i == i'
  | (Float f, Float f') => f == f'
  | (_, _) => false
  };

let fIdEql (id: fId) (id': fId) :bool =>
  switch (id, id') {
  | (Int i, Int i') => i == i'
  | (String s, String s') => s == s'
  | (_, _) => false
  };

let aggEql (a: agg) (a': agg) :bool => a == a';

let constOrColEql (e: constOrCol) (e': constOrCol) =>
  switch (e, e') {
  | (Id s, Id s') => s == s'
  | (Int n, Int n') => n == n'
  | (Float f, Float f') => f == f'
  | (_, _) => false
  };

let fExpTypeEql (e: fExpType) (e': fExpType) :bool =>
  switch (e, e') {
  | (FEqual a a', FEqual b b')
  | (FNotEqual a a', FNotEqual b b')
  | (FGreaterThan a a', FGreaterThan b b')
  | (FLessThan a a', FLessThan b b')
  | (FGreaterThanEq a a', FGreaterThanEq b b')
  | (FLessThanEq a a', FLessThanEq b b')
  | (FIlike a a', FIlike b b')
  | (FLike a a', FLike b b')
  | (FBetween a a', FBetween b b') => constOrColEql a b && constOrColEql a' b'
  | (_, _) => false
  };

let rec fOperationExpEql (f: fOperationExp) (f': fOperationExp) :bool =>
  switch (f, f') {
  | (FOperationExp exp inv, FOperationExp exp' inv') => fExpTypeEql exp exp' && inv == inv'
  | (FOperationExpList exps, FOperationExpList exps') => List.for_all2 fOperationExpEql exps exps'
  | (_, _) => false
  };

let sortOrderEql (s: sortOrder) (s': sortOrder) :bool =>
  switch (s, s') {
  | (ASC, ASC) => true
  | (DESC, DESC) => true
  | (_, _) => false
  };

let collectEql (c: collect) (c': collect) :bool =>
  switch (c, c') {
  | (CSort sort order, CSort sort' order') => sort == sort' && order == order'
  | (CLimit lim num, CLimit lim' num') => lim == lim' && num == num'
  | (_, _) => false
  };

let rec fEqualsEql (e: fEquals) (e': fEquals) :bool =>
  switch (e, e') {
  | (String s, String s') => s == s'
  | (Int n, Int n') => n == n'
  | (Float f, Float f') => f == f'
  | (List l, List l') => List.for_all2 fEqualsEql l l'
  | (_, _) => false
  };

let filterEql (f: filter) (f': filter) :bool =>
  switch (f, f') {
  | (FExpression id exp, FExpression id' exp') => id == id' && exp == exp'
  | (FExact id exp eq, FExact id' exp' eq') => fIdEql id id' && exp == exp' && fEqualsEql eq eq'
  | (FRange id exp (MinMax (e, e')), FRange id' exp' (MinMax (e'', e'''))) =>
    fIdEql id id' && exp == exp' && constOrColEql e e'' && constOrColEql e' e'''
  | (FOperation id fOp, FOperation id' fOp') => fIdEql id id' && fOperationExpEql fOp fOp'
  | (_, _) => false
  };

let formulaEql (f: formula) (f': formula) :bool =>
  switch (f, f') {
  | (FExp exp alias, FExp exp' alias') => exp == exp' && alias == alias'
  | (FDateTrunc dt alias, FDateTrunc dt' alias') => dt == dt' && alias == alias'
  | (FExtract e alias, FExtract e' alias') => e == e' && alias == alias'
  | (_, _) => false
  };

let ignoreTypeEql (i: ignoreType) (i': ignoreType) :bool =>
  switch (i, i') {
  | (STR str, STR str') => str == str'
  | (Int i, Int i') => i == i'
  | (Float f, Float f') => f == f'
  | (_, _) => false
  };

let transformEql (t: transform) (t': transform) :bool =>
  switch (t, t') {
  | (Aggregate a, Aggregate a') => aggEql a a'
  | (Bin i e m a, Bin i' e' m' a') => i == i' && e == e' && m == m' && a == a'
  | (Collect c, Collect c') => collectEql c c'
  | (Filter f, Filter f') => filterEql f f'
  | (Formula form, Formula form') => formulaEql form form'
  | (Sample (SMultiplicative size lim), Sample (SMultiplicative size' lim')) =>
    numberEql size size' && numberEql lim lim'
  | (Crossfilter str filters, Crossfilter str' filters') =>
    str == str' && List.for_all2 filterEql filters filters'
  | (ResolveFilter str ignoreTypes, ResolveFilter str' ignoreTypes') =>
    str == str' && List.for_all2 ignoreTypeEql ignoreTypes ignoreTypes'
  | (_, _) => false
  };

let sqlAstEql (s: sql) (s': sql) :bool =>
  switch (s, s') {
  | (SQL s t, SQL s' t') =>
    s == s' && (
      switch (t, t') {
      | (None, None) => true
      | (Some l, Some l') => List.for_all2 transformEql l l'
      | (_, _) => false
      }
    )
  };

/* to string functions  */
let indentStr (indent: int) (s: string) :string => String.make indent ' ' ^ s;

let optionToString (op: option 't) (toS: 't => string) :string =>
  switch op {
  | None => "None"
  | Some v => "Some(" ^ toS v ^ ")"
  };

let numberToString: number => string =
  fun
  | Int i => "Int(" ^ string_of_int i ^ ")"
  | Float f => "Float(" ^ string_of_float f ^ ")";

let constOrColToString: constOrCol => string =
  fun
  | Id i => "Id(" ^ i ^ ")"
  | Int n => "Int(" ^ string_of_int n ^ ")"
  | Float n => "Float(" ^ string_of_float n ^ ")"
  | Str s => "String(" ^ s ^ ")";

let aggToString: agg => string =
  fun
  | AVG c => "AVG(" ^ constOrColToString c ^ ")"
  | COUNT c => "COUNT(" ^ constOrColToString c ^ ")"
  | MIN c => "MIN(" ^ constOrColToString c ^ ")"
  | MAX c => "MAX(" ^ constOrColToString c ^ ")"
  | SUM c => "SUM(" ^ constOrColToString c ^ ")";

let extractToString: extract => string =
  fun
  | EYear id => "EYear(" ^ id ^ ")"
  | EQuarter id => "EQuarter(" ^ id ^ ")"
  | EMonth id => "EMonth(" ^ id ^ ")"
  | EDom id => "EDom(" ^ id ^ ")"
  | EDow id => "EDow(" ^ id ^ ")"
  | EHour id => "EHour(" ^ id ^ ")"
  | EMinute id => "EMinute(" ^ id ^ ")";

let dateTruncToString: dateTrunc => string =
  fun
  | DTYear id => "DTYear(" ^ id ^ ")"
  | DTQuarter id => "DTQuarter(" ^ id ^ ")"
  | DTMonth id => "DTMonth(" ^ id ^ ")"
  | DTWeek id => "DTWeek(" ^ id ^ ")"
  | DTDay id => "DTDay(" ^ id ^ ")"
  | DTHour id => "DTHour(" ^ id ^ ")";

let sortOrderToString: sortOrder => string =
  fun
  | ASC => "ASC"
  | DESC => "DSC";

let fExpTypeToString: fExpType => string =
  fun
  | FEqual e e' =>
    String.concat "" ["FEqual(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FNotEqual e e' =>
    String.concat "" ["FNotEqual(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FGreaterThan e e' =>
    String.concat "" ["FGreaterThan(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FLessThan e e' =>
    String.concat "" ["FLessThan(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FGreaterThanEq e e' =>
    String.concat "" ["FGreaterThanEq(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FLessThanEq e e' =>
    String.concat "" ["FLessThanEq(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FIlike e e' =>
    String.concat "" ["FIlike(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FLike e e' =>
    String.concat "" ["FLike(", constOrColToString e, ", ", constOrColToString e', ")"]
  | FBetween e e' =>
    String.concat "" ["FBetween(", constOrColToString e, ", ", constOrColToString e', ")"];

let fIdToString: fId => string =
  fun
  | String s => "String(" ^ s ^ ")"
  | Int i => "Int(" ^ string_of_int i ^ ")";

let rec fEqualsToString: fEquals => string =
  fun
  | String s => "String(" ^ s ^ ")"
  | Int i => "Int(" ^ string_of_int i ^ ")"
  | Float f => "Float(" ^ string_of_float f ^ ")"
  | List feqs => "List(" ^ String.concat ", " (List.map fEqualsToString feqs) ^ ")";

let rec fOperationExpToString: fOperationExp => string =
  fun
  | FOperationExp fexp inv =>
    String.concat
      "" ["FOperationExp(", fExpTypeToString fexp, ", ", optionToString inv string_of_bool, ")"]
  | FOperationExpList fop =>
    "FOperationExpList(" ^ String.concat ", " (List.map fOperationExpToString fop) ^ ")";

let filterToString: filter => string =
  fun
  | FExpression i (ExprSTR s) =>
    String.concat "" ["FExpression(", fIdToString i, ",", "ExprSTR(", s, "))"]
  | FExact i c e =>
    String.concat
      "" ["FExact(", fIdToString i, ", ", constOrColToString c, ", ", fEqualsToString e, ")"]
  | FRange i c (MinMax (c', c'')) =>
    String.concat
      ""
      [
        "FRange(",
        fIdToString i,
        ", ",
        constOrColToString c,
        ", ",
        "MinMax(",
        constOrColToString c',
        ", ",
        constOrColToString c'',
        ")",
        ")"
      ]
  | FOperation i fop =>
    String.concat "" ["FOperation(", fIdToString i, ", ", fOperationExpToString fop, ")"];

let collectToString: collect => string =
  fun
  | CSort i o => String.concat "" ["CSort(", i, ", ", optionToString o sortOrderToString, ")"]
  | CLimit l o =>
    String.concat "" ["CLimit(", string_of_int l, ", ", optionToString o string_of_int, ")"];

let formulaToString: formula => string =
  fun
  | FExp s s' => String.concat "" ["FExp(", s, ", ", optionToString s' (fun x => x), ")"]
  | FDateTrunc dt s =>
    String.concat
      "" ["FDateTrunc(", dateTruncToString dt, ", ", optionToString s (fun x => x), ")"]
  | FExtract e s =>
    String.concat "" ["FExtract(", extractToString e, ", ", optionToString s (fun x => x), ")"];

let sampleToString: sample => string =
  fun
  | SMultiplicative n n' =>
    String.concat "" ["SMultiplicative(", numberToString n, ", ", numberToString n', ")"];

let ignoreTypeToString: ignoreType => string =
  fun
  | STR s => "STR(" ^ s ^ ")"
  | Int n => "Int(" ^ string_of_int n ^ ")"
  | Float f => "Float(" ^ string_of_float f ^ ")";

let transFormToString: transform => string =
  fun
  | Aggregate a => "Aggregate(" ^ aggToString a ^ ")"
  | Bin id (MinMax (l, h)) maxBins a =>
    "Bin(" ^
    id ^
    ", " ^
    "MinMax(" ^
    numberToString l ^ "," ^ numberToString h ^ ")," ^ string_of_int maxBins ^ ", " ^ a ^ ")"
  | Collect c => "Collect(" ^ collectToString c ^ ")"
  | Filter f => "Filter(" ^ filterToString f ^ ")"
  | Formula form => "Formula(" ^ formulaToString form ^ ")"
  | Sample s => "Sample(" ^ sampleToString s ^ ")"
  | Crossfilter s fs =>
    String.concat
      "" ["Crossfilter(", s, ",<", String.concat ", " (List.map filterToString fs), ">)"]
  | ResolveFilter s igts =>
    String.concat
      "" ["ResolveFilter(", s, ",<", String.concat ", " (List.map ignoreTypeToString igts), ">)"];

let sqlToString: sql => string =
  fun
  | SQL datum None => "SQL(" ^ datum ^ ", None)"
  | SQL datum (Some transforms) =>
    "SQL(" ^ datum ^ "\n" ^ String.concat ", \n" (List.map transFormToString transforms) ^ ")";
