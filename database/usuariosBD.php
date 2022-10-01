<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/common/DataServices.php';

class usuariosBD {
    //method declaration

    public function ObtTodosUsuariosDB($activo, $rolIds, $opcCelular){
        $ds = new DataServices();
        $param[0] = "";
        $query = array();
        
        if($activo > -1){
            $query[] = " activo=$activo ";
        }
        if($rolIds != ""){
            $query[] = " idRol IN($rolIds) ";
        }
        //aprueba procesos
        if($opcCelular > 0){
            $query[] = " celular IS NOT NULL ";
        }

        //En caso de llevar filtro
        if(count($query) > 0){
          $wordWhere = " WHERE ";
          $setWhere = implode(" AND ", $query);
          // echo $setWhere;
          $param[0] = $wordWhere.$setWhere;
        }

        $result = $ds->Execute("ObtTodosUsuariosDB", $param);
        $ds->CloseConnection();
        return $result;
    }
    


    public function LoginUser($email, $password){
        $ds = new DataServices();
        $param[0]= $email;
        $param[1]= $password;

        $result = $ds->Execute("LoginUser", $param);
        $ds->CloseConnection();

        return $result;
    }

    public function UserByID($idUser){
        $ds = new DataServices();
        $param[0]= $idUser;
        $result = $ds->Execute("UserByID", $param);
        $ds->CloseConnection();

        return $result;
    }    
    
    public function UsersDataSet($ds){
        $dsO = new DataServices();
        $param[0] = "";
        $query = array();
        if($_SESSION['idSucursal'] > -1){
            $query[] = " sucursalId=".$_SESSION['idSucursal'] ." ";
        }

        //En caso de llevar filtro
        if(count($query) > 0){
          $wordWhere = " WHERE ";
          $setWhere = implode(" AND ", $query);
          // echo $setWhere;
          $param[0] = $wordWhere.$setWhere;
        }
        // print_r($param);
        // exit();
        $ds->SelectCommand = $dsO->ExecuteDS("getUsersForGrid", $param);
        $param = null;
        $ds->DeleteCommand = $dsO->ExecuteDS("deleteUserGrid", $param);
        // $ds->UpdateCommand = $dsO->ExecuteDS("updateUserGrid", $param);
        // $ds->InsertCommand = $dsO->ExecuteDS("insertUserGrid", $param);
        $dsO->CloseConnection();

        return $ds;
    }
    
    public function UserByEmailDB($email){
        $ds = new DataServices();
        $param[0]= $email;
        $result = $ds->Execute("UserByEmailDB", $param);
        $ds->CloseConnection();
        return $result;
    }

    public function updateUsuarioDB($param){
        $ds = new DataServices();
        $result = $ds->Execute("updateUsuarioDB", $param, false, true);
        $ds->CloseConnection();
        return $result;
    }

    public function insertUsuarioDB($param){
        $ds = new DataServices();
        $result = $ds->Execute("insertUsuarioDB", $param, true);
        return $result;
    }

    public function actualizarUsuarioDB($param){
        $ds = new DataServices();
        $result = $ds->Execute("actualizarUsuarioDB", $param, false, true);
        $ds->CloseConnection();
        return $result;
    }
    // //Recuperar contrasenia por su email
    

    // //Recuperar datos por numero de contrato y email
    // public function UserByContractEmailDB($contrat, $email)
    // {
    //     $ds = new DataServices();
    //     $param[0]= $contrat;
    //     $param[1]= $email;

    //     $result = $ds->Execute("UserByContractEmailDB", $param);
    //     $ds->CloseConnection();
    //     return $result;
    // }
    //Obtener usuarios por rol
    public function obtUsuariosByNomEmailDB($dato, $campo){
        $ds = new DataServices();
        $param[0] = $campo;
        $param[1] = $dato;
        $result = $ds->Execute("obtUsuariosByNomEmailDB", $param);
        $ds->CloseConnection();
        return $result;
    }

    public function obtPorRolesDB($activo, $idRol){
        $ds = new DataServices();
        $param[0] = "";
        $query = array();

        if($idRol > 1){
            $query[] = " idRol=$idRol ";
        }

        if($activo > -1){
            $query[] = " activo=$activo ";
        }
        //En caso de llevar filtro
        if(count($query) > 0){
          $wordWhere = " WHERE ";
          $setWhere = implode(" AND ", $query);
          // echo $setWhere;
          $param[0] = $wordWhere.$setWhere;
        }
        $result = $ds->Execute("ObtTodosUsuariosDB", $param);
        $ds->CloseConnection();
        return $result;
    } 

    public function deleteUsuarioDB($param){
      $ds = new DataServices();
      $result = $ds->Execute("deleteUsuarioDB", $param, false, true);
      $ds->CloseConnection();
      return $result;
    }
    
    //Obtener datos por el identificador y tipo
    public function UsuarioPorClaveTipoDB($id, $tipo){
        $ds = new DataServices();
        $param[0]= $id;
        $param[1]= $tipo;
        $result = $ds->Execute("UsuarioPorClaveTipoDB", $param);
        $ds->CloseConnection();
        return $result;
    }

    public function ObtUsuariosRolSucursalDB($activo, $rolIds, $opcCelular, $sucursalId = ""){
        $ds = new DataServices();
        $param[0] = "";
        $query = array();
        
        if($activo > -1){
            $query[] = " activo=$activo ";
        }
        if($rolIds != ""){
            $query[] = " idRol IN($rolIds) ";
        }
        //aprueba procesos
        if($opcCelular > 0){
            $query[] = " celular IS NOT NULL ";
        }

        if($sucursalId != ""){
            $query[] = " sucursalId=$sucursalId ";
        }

        //En caso de llevar filtro
        if(count($query) > 0){
          $wordWhere = " WHERE ";
          $setWhere = implode(" AND ", $query);
          // echo $setWhere;
          $param[0] = $wordWhere.$setWhere;
        }

        $result = $ds->Execute("ObtUsuariosRolSucursalDB", $param);
        $ds->CloseConnection();
        return $result;
    }
}