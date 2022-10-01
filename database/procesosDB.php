<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/common/DataServices.php';

class procesosDB {

  //obtiene coleccion
  public function ObtProcesosDB($activo, $nombre, $codigo, $historial){
    $ds = new DataServices();
    $param[0] = "";
    $param[1] = "";
    $query = array();

    if($activo != -1){
      $query[] = " a.activo=$activo ";
    }

    if($nombre != ""){
      $query[] = " a.nombre LIKE '%".$nombre."%' ";
    }

    if($codigo != ""){
      $query[] = " a.codigo LIKE '%".$codigo."%' ";
    }

    if($historial != -1){
      $query[] = " a.historial=$historial ";
    }
    
    // En caso de llevar filtro
    if(count($query) > 0){
      $wordWhere = " WHERE ";
      $setWhere = implode(" AND ", $query);
      // echo $setWhere;
      $param[1] = $wordWhere.$setWhere;
    }
    // $param[2] = " ORDER BY a.codigo ASC, a.fechaCreacion DESC ";
    $param[2] = " ORDER BY a.codigo ASC ";
    
    $result = $ds->Execute("ObtProcesosDB", $param);
    $ds->CloseConnection();
    return $result;
  }  

  public function ObtProcesoPorIdDB($id)
  {
      $ds = new DataServices();
      $param[0]= $id;
      $result = $ds->Execute("ObtProcesoPorIdDB", $param);
      $ds->CloseConnection();
      return $result;
  }

  public function InsProcesoDB($param){
    $ds = new DataServices();
    $result = $ds->Execute("InsProcesoDB", $param, true);
    $ds->CloseConnection();
    return $result;
  }

  public function ActProcesoDB($param){
    $ds = new DataServices();
    $result = $ds->Execute("ActProcesoDB", $param, false, true);
    $ds->CloseConnection();
    return $result;
  }  
  
 /* public function ProcesosDataSet($ds, $idUsuario, $filSel, $filTexto){
    $dsO = new DataServices();    
    $param[0] = "";
    $param[1] = "";
    $query = array();

    //id usuario (administrador ve todo)
    if($idUsuario > 0){
      $query2 = "";
      //duenio
      $query2 .= " , IF(a.usuarioIdDueno=".$idUsuario.",'mostrarCampo','ocultaCampo') AS mo_dp_clase ";
      //validador
      $query2 .= " , IF(a.usuarioIdValidador=".$idUsuario." AND a.catEstatusId=2,'mostrarCampo','ocultaCampo') AS mo_val_clase ";
      $param[0] = $query2;
    }else{
      // $param[0] = " , IF(a.historial=0,'mostrarCampo','') AS mo_dp_clase ";
      $param[0] = "  ";
    }
    

    $query[] = " a.historial=0 "; //obtener solo los que no estan en historial

    if($filSel != ""){
      if($filSel==1){
        $query[] = " a.nombre LIKE '%".$filTexto."%' ";
      }
      if($filSel==2){
        $query[] = " a.codigo LIKE '%".$filTexto."%' ";
      }
    }  
    
    // En caso de llevar filtro
    if(count($query) > 0){
      $wordWhere = " WHERE ";
      $setWhere = implode(" AND ", $query);
      // echo $setWhere;
      $param[1] = $wordWhere.$setWhere;
    }
    // $param[2] = " ORDER BY a.codigo ASC, a.fechaCreacion DESC ";
    $param[2] = " ORDER BY a.codigo ASC ";

    // echo "<pre>";
    // print_r($param);
    // echo "</pre>";

    $ds->SelectCommand = $dsO->ExecuteDS("ObtProcesosDB", $param);
    // $param = null;
    // $ds->UpdateCommand = $dsO->ExecuteDS("actTipoPrecioGrid", $param);
    // $ds->InsertCommand = $dsO->ExecuteDS("insTipoPrecioGrid", $param);
    // $ds->DeleteCommand = $dsO->ExecuteDS("delTipoPrecioGrid", $param);
    $dsO->CloseConnection();

    return $ds;
  }*/
  
  public function ProcesosDataSet2($idUsuario, $filSel, $filTexto, $procPrincipalId){
    $dsO = new DataServices();    
    $param[0] = "";
    $param[1] = "";
    $query = array();

    //id usuario (administrador ve todo)
    if($idUsuario > 0){
      $query2 = "";
      //duenio
      $query2 .= " , IF(a.usuarioIdDueno=".$idUsuario.",'mostrarCampo','ocultaCampo') AS mo_dp_clase ";
      //validador
      $query2 .= " , IF(a.usuarioIdValidador=".$idUsuario." AND a.catEstatusId=2,'mostrarCampo','ocultaCampo') AS mo_val_clase ";
      $query2 .= " , IF(a.usuarioIdValidador=".$idUsuario.",'mostrarCampo','') AS mo_sp_clase ";  //Revision
      $param[0] = $query2;
    }else{
      // $param[0] = " , IF(a.historial=0,'mostrarCampo','') AS mo_dp_clase ";
      $param[0] = "  ";
    }
    
    $query[] = " a.historial=0 "; //obtener solo los que no estan en historial
    $query[] = " a.procPrincipalId=".$procPrincipalId." "; //Revisar


    if($filSel != ""){
      if($filSel==1){
        $query[] = " a.nombre LIKE '%".$filTexto."%' ";
      }
      if($filSel==2){
        $query[] = " a.codigo LIKE '%".$filTexto."%' ";
      }
    }  

    //Imp. 15/10/19 Muestra solo aquellos procesos a los que es dueno y validador sin importar el departamento
    if(isset($_SESSION['idRol']) && $_SESSION['idRol']!=1){
      /*if($departamentoId!=""){
        $query[] = " ( usuarioIdDueno=".$idUsuario." OR usuarioIdValidador=".$idUsuario." OR departamentoId IN (".$departamentoId.") ) ";
      }else{
        $query[] = " ( usuarioIdDueno=".$idUsuario." OR usuarioIdValidador=".$idUsuario." ) ";
      }      */

      $query[] = " ( a.usuarioIdDueno=".$idUsuario." OR a.usuarioIdValidador=".$idUsuario." )  ";
      // $query[] = " ( (a.usuarioIdDueno=".$idUsuario." OR a.usuarioIdValidador=".$idUsuario.") AND a.catEstatusId=2 ) ";
    }

    
    // En caso de llevar filtro
    if(count($query) > 0){
      $wordWhere = " WHERE ";
      $setWhere = implode(" AND ", $query);
      // echo $setWhere;
      $param[1] = $wordWhere.$setWhere;
    }
    // $param[2] = " ORDER BY a.codigo ASC, a.fechaCreacion DESC ";
    $param[2] = " ORDER BY a.codigo ASC ";

    // echo "<pre>";
    // print_r($param);
    // echo "</pre>";

    // $ds->SelectCommand = $dsO->ExecuteDS("ObtProcesosDB", $param);    
    // $dsO->CloseConnection();

    $ds = new DataServices();
    $result = $ds->Execute("ObtProcesosDB", $param);
    $ds->CloseConnection();
    return $result;

    // return $ds;
  }


  // //Delete informacion
  // public function deleteCatEstatusDB($param){
  //     $ds = new DataServices();
  //     $result = $ds->Execute("deleteCatEstatusDB", $param, false, true);
  //     $ds->CloseConnection();
  //     return $result;
  // }
  //actualiza campo
  public function ActCampoProcesoDB($param){
    $ds = new DataServices();
    $result = $ds->Execute("ActCampoProcesoDB", $param, false, true);
    $ds->CloseConnection();
    return $result;
  }

  public function ProcesosHistDataSet($ds, $filSel, $filTexto, $idRaiz){
    $dsO = new DataServices();
    $param[0] = "";
    $param[1] = "";
    $query = array();

    $query[] = " a.historial=1 "; //obtener solo los que no estan en historial
    if($filSel != ""){
      if($filSel==1){
        $query[] = " a.nombre LIKE '%".$filTexto."%' ";
      }
      if($filSel==2){
        $query[] = " a.codigo LIKE '%".$filTexto."%' ";
      }
    }
      $query[] = " a.procRaizId = ".$idRaiz." ";
    // En caso de llevar filtro
    if(count($query) > 0){
      $wordWhere = " WHERE ";
      $setWhere = implode(" AND ", $query);
      // echo $setWhere;
      $param[1] = $wordWhere.$setWhere;
    }
    // $param[2] = " ORDER BY a.codigo ASC, a.fechaCreacion DESC ";
    $param[2] = " ORDER BY a.codigo ASC ";
    $ds->SelectCommand = $dsO->ExecuteDS("ObtProcesosDB", $param);
    // echo "<pre>";
    // var_dump($ds->SelectCommand);
    // die();
    $dsO->CloseConnection();
    return $ds;
  }
}
