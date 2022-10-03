<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/database/usuariosBD.php';
include_once  $dirname.'/database/datosBD.php';
/*include_once  $dirname.'/brules/configuracionesGridObj.php';*/
include_once  $dirname.'/brules/rolesObj.php';
/*include_once  $dirname.'/brules/catSucursalesObj.php';*/

class usuariosObj {
    private $_idUsuario = 0;
    private $_idRol = 0;    
    private $_idUnAd = 0;
    private $_nombre = '';
    private $_apPaterno = '';
    private $_apMaterno = '';
    private $_correo = '';
    private $_password = '';
    private $_activo = 0;
    private $_fechaCreacion = '0000-00-00 00:00:00';    
    //private $_fechaAct = '0000-00-00 00:00:00';

    //extras
    // private $_usuarioActivo = '';
    // private $_nombreImg = '';        

    //get y set
    public function __get($name) {
        return $this->{"_".$name};
    }
    public function __set($name, $value) {
        $this->{"_".$name} = $value;
    }

    public function ObtTodosUsuarios($activo=-1, $rolIds="", $opcCelular=0){
        $array = array();
        $ds = new usuariosBD();
        $datosBD = new datosBD();
        $result = $ds->ObtTodosUsuariosDB($activo, $rolIds, $opcCelular);
        $array =  $datosBD->arrDatosObj($result);

        return $array;
    }

    public function obtPorRoles($activo=-1, $rolIds=0){
        $array = array();
        $ds = new usuariosBD();
        $datosBD = new datosBD();
        $result = $ds->obtPorRolesDB($activo, $rolIds);
        $array =  $datosBD->arrDatosObj($result);

        return $array;
    }

    public function 

    //logueo de usuario
    public function LoginUser($email, $password){
        $usrDS = new usuariosBD();
        $datosBD = new datosBD();
        $obj =  new usuariosObj();
        $result = $usrDS->LoginUser($email, $password);

        return $datosBD->setDatos($result, $obj);
    }

    //usuario por id
    public function UserByID($id){
        $usrDS = new usuariosBD();
        $obj = new usuariosObj();
        $datosBD = new datosBD();
        $result = $usrDS->UserByID($id);
        
        return $datosBD->setDatos($result, $obj);
              
    }
    
    //Usuario por email (para recupera la contrasenia)
    public function UserByEmail($email){
        $usrDS = new usuariosBD();
        $obj = new usuariosObj();
        $datosBD = new datosBD();
        $result = $usrDS->UserByEmailDB($email);
        return $datosBD->setDatos($result,$obj);
    }

    //Usuario por no. contrato e email
    public function UserByContractEmail($contrat, $email){
        $usrDS = new usuariosBD();
        $datosBD = new datosBD();
        $result = $usrDS->UserByContractEmailDB($contrat, $email);
        return $datosBD->setDatos($result);
    }
    
    public function GuardarUsuario(){
        $objDB = new usuariosBD();
        $this->_idUsuario = $objDB->insertUsuarioDB($this->getParams());
    }

    public function EditarUsuario(){
        $objDB = new usuariosBD();
        return $objDB->actualizarUsuarioDB($this->getParams(true));
    }

    private function getParams($update = false){   
        $dateByZone = obtDateTimeZone();
        $this->_fechaCreacion = $dateByZone->fechaHora;
        $this->_fechaAct = $dateByZone->fechaHora;
                
        $param[0] = $this->_idRol;
        $param[1] = $this->_sucursalId;
        $param[2] = $this->_nombre;
        $param[3] = $this->_email;
        $param[4] = $this->_password;
        $param[5] = $this->_activo;
        $param[6] = $this->_celular;

        if($update==false){
            $param[7] = $this->_fechaCreacion;
        }
        else{
            $param[7] = $this->_fechaAct;
            $param[8] = $this->_idUsuario;
        }

        return $param;
    }

    public function ActualizarUsuario($campo, $valor, $id){
        $param[0] = $campo;
        $param[1] = $valor;
        $param[2] = $id;

        $objDB = new usuariosBD();
        $resAct = $objDB->updateUsuarioDB($param);
        return $resAct;
    }

    public function EliminarUsuario($idUsuario){
        $objDB = new usuariosBD();
        $param[0] = $idUsuario;
        return $objDB->deleteUsuarioDB($param);
    }


    //Obtener datos por el identificador y tipo
    public function UsuarioPorClaveTipo($id, $tipo){
        $usrDS = new usuariosBD();
        $obj = new usuariosObj();
        $datosBD = new datosBD();
        $result = $usrDS->UsuarioPorClaveTipoDB($id, $tipo);
        return $datosBD->setDatos($result,$obj);
    }

    public function ObtUsuariosRolSucursal($activo=-1, $rolIds="", $opcCelular=0, $sucursalId = ""){
        $array = array();
        $ds = new usuariosBD();
        $datosBD = new datosBD();
        $result = $ds->ObtUsuariosRolSucursalDB($activo, $rolIds, $opcCelular, $sucursalId);
        $array =  $datosBD->arrDatosObj($result);

        return $array;
    }
}
