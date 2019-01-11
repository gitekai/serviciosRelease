import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generaWhere = (
  paramOperationObj = {},
  countStart = 1,
  attrToDBField = {}
) => {
  let count = countStart;
  const result = { statements: [], values: [] };
  Object.keys(paramOperationObj).forEach(currVal => {
    const [attr_tmp, operator] = currVal.split("_");
    let attr;
    if (attrToDBField[attr_tmp]) {
      attr = attrToDBField[attr_tmp];
    } else {
      attr = attr_tmp;
    }
    console.log(`attr = ${attr}`);

    const value = paramOperationObj[currVal];

    let operatorDB;
    switch (operator) {
      case "regex":
        operatorDB = "~*";
        break;
      case "not":
        operatorDB = "!=";
    }

    if (value && operatorDB && attr) {
      result.values.push(value);
      result.statements.push(`${attr} ${operatorDB} $${count++}`);
    }
  });

  const statement =
    result.statements.length > 0
      ? "WHERE " + result.statements.join(" AND ")
      : "";
  return {
    statement,
    values: result.values
  };
};

const createToken = async (user, permisos, secret) => {
  const { id, email, nombre } = user;
  let token;
  try {
    token = await jwt.sign({ id, email, nombre, permisos }, secret, {
      expiresIn: "480m"
    });
  } catch (e) {
    throw e;
  }

  return { token };
};

const checkUserAndScopes = (user, permisosNeeded) => {
  if (!user) {
    throw new Error("Not Authenticated");
  }

  const permisosObtained = user.permisos;
  console.log("permissions obtained = ");
  console.log(permisosObtained);
  if (permisosObtained.includes("ALL")) {
    return;
  }

  const hasPermission = permisosNeeded.reduce((bool, permiso) => {
    if (typeof permiso === "string") {
      if (permisosObtained.includes(permiso)) {
        // OK todo en orden
        bool = true;
      }
    }
    if (Array.isArray(permiso)) {
      const resumen = permiso.map(p => {
        if (permisosObtained.includes(p)) {
          return true;
        }
        return false;
      });
      if (resumen.every(res => res === true)) {
        bool = true;
      }
    }

    return bool;
  }, false);

  if (!hasPermission) {
    throw new Error("Permissions needed " + permisosNeeded.join(","));
  }
};
const generaSETPart = (columnToValue, countStart = 1) => {
  let count = countStart;
  const columnsWithValues = Object.entries(columnToValue).filter(
    ([key, val]) => val != null
  );

  const queryString = columnsWithValues
    .map(([key, val]) => {
      if (val) {
        return `${key} = $${++count}`;
      }
      return null;
    })
    .join(",");

  const vars = columnsWithValues.map(([_, val]) => val);

  return { query: queryString, vars };
};



/** 
* Genera un objeto que proporciona todo lo necesario para hacer un insert 
* @param {Object[]} args - Contiene los nombres de columna de la tabla de la BBDD con sus valores
* @param {number} [argCount=1] - Indica donde empezar a contar los placeholder de los valores ($X,$Y)  
* @return {{statement:{questionMarks:string, columNames:string},vars:Array}}
*/
const generaInsertPart = (args = [], argCount = 1) => {
  //filtro el array para que no contenga objetos con valores nulos
  const nonNullObject = args.filter(arg => Object.values(arg)[0] != null);

  //Genero la parte de values($1,$2,$3)
  let count = argCount;
  const questionMarks = nonNullObject.map(_ => `$${count++}`).join(",");

  //Genero los nombres de columna correspondientes
  const columnNames = nonNullObject
    .map(varr => `${Object.keys(varr)[0]}`)
    .join(",");

  //los valores tambíen hacen falta
  const vars = nonNullObject.map(obj => Object.values(obj)[0]);

  return {
    statement: {
      questionMarks,
      columnNames
    },
    vars
  };
};

const passwordToHash = password => {
  if (!password) {
    return null;
  }

  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const checkAllowedItemsReturnedByQuery = (
  maxQueriesAllowed,
  maxQueriesWanted,
  domainObject = "Not specified domain object"
) => {
  if (maxQueriesWanted > maxQueriesAllowed) {
    throw new Error(
      `It is not possible to return more than ${maxQueriesAllowed} records in ${domainObject}`
    );
  }
};

export {
  checkAllowedItemsReturnedByQuery,
  generaWhere,
  generaSETPart,
  generaInsertPart,
  createToken,
  checkUserAndScopes,
  passwordToHash
};
