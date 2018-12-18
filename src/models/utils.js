import jwt from 'jsonwebtoken'



const generaWhere = (paramOperationObj={},countStart=1, attrToDBField = {}) => {

  let count = countStart;
  const result = {statements: [], values: []};
  Object.keys(paramOperationObj).forEach(currVal => {
    const [attr_tmp, operator] = currVal.split("_");
    let attr;
    if (attrToDBField[attr_tmp]) {
      attr = attrToDBField[attr_tmp];
    } else {
      attr = attr_tmp;
    }

    const value = paramOperationObj[currVal];

    let operatorDB;
    switch (operator) {
      case "regex":
        operatorDB = "~*";
        break;
      case "not":
        operatorDB = "!=";
    }

    if(value && operatorDB && attr ){
      result.values.push(value)
      result.statements.push(`${attr} ${operatorDB} $${count++}`)
    }
  });

  const statement = (result.statements.length > 0) ? 'WHERE '+result.statements.join(' AND ') : '';
  return {
    statement,
    values: result.values,
  }
}

const createToken = async ( user, permisos, secret ) => {
  const { id, email, nombre } = user; 
  let token; 
  try{
    token = await jwt.sign({id,email,nombre,permisos}, secret, { expiresIn: '60m' });
  } catch(e){
    throw e; 
  }

  return {token}; 
}

const checkUserAndScopes = (user, permisosNeeded ) => {
  if(!user){
    throw new Error("Not Authenticated");
  }

  const permisosObtained = user.permisos; 
  console.log("permissions obtained = ")
  console.log(permisosObtained)
  if(permisosObtained.includes('ALL')){
    return 
  }

  const hasPermission = permisosNeeded.reduce( (bool, permiso) => {
    if(typeof permiso === 'string'){
 
      if(permisosObtained.includes(permiso)){
        // OK todo en orden 
        bool=true;
      }
    } 
    if(Array.isArray(permiso)){
      const resumen = permiso.map(p => {
        if(permisosObtained.includes(p)){
          return true
        }
        return false
      })
      if(resumen.every(res => res === true )){
        bool = true; 
      }
    }

    return bool ; 
  },false); 

  if(! hasPermission){
    throw new Error("Permissions needed " + permisosNeeded.join(','));
  }
}


export {generaWhere, createToken, checkUserAndScopes};
