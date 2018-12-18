import erp2d2, {c3} from '../database'; 
import Pais from './pais';
import Comercial from './comercial';
import Usuario from './usuario';

const model = {
  Pais: new Pais(erp2d2),
  Comercial: new Comercial(erp2d2),
  Usuario: new Usuario(erp2d2),
};

export default model; 