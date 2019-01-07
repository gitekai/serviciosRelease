import erp2d2, {c3} from '../database'; 
import Pais from './pais';
import Comercial from './comercial';
import Usuario from './usuario';
import GrupoEmpresarial from './grupoEmpresarial';
import Producto from './producto';
import ProductoERPv1 from './productoERPv1';
import Oportunidad from './oportunidad';


const model = {
  Pais: new Pais(erp2d2),
  Comercial: new Comercial(erp2d2),
  Usuario: new Usuario(erp2d2),
  GrupoEmpresarial: new GrupoEmpresarial(erp2d2),
  ProductoERPv1: new ProductoERPv1(erp2d2),
  Oportunidad: new Oportunidad(erp2d2),
  Producto: new Producto(erp2d2),
};

export default model; 