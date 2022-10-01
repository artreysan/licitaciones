<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/database/procesosDB.php';
include_once  $dirname.'/database/datosBD.php';
include_once  $dirname.'/brules/configuracionesGridObj.php';

class procesosObj extends configuracionesGridObj{
    private $_idProceso = 0;
    private $_nombre = '';
    private $_version = '';
    private $_codigo = '';
    private $_procPrincipalId =  0;
    private $_procRaizId = 0;
    private $_usuarioIdDueno = 0;
    private $_usuarioIdValidador = 0;
    private $_catEstatusId = 0;
    private $_descripcion = '';
    private $_urlDiagrama = '';
    private $_activo = 1;
    private $_historial = 1;
    private $_fechaCreacion = '0000-00-00 00:00:00';
    private $_fechaAct = '0000-00-00 00:00:00';
    private $_idUsuarioCmb = 0;
    private $_departamentoId = 0;
    private $_codigoFormato = '';
    private $_fechaRevision = '0000-00-00';
    

    //get y set
    public function __get($name) {
        return $this->{"_".$name};
    }
    public function __set($name, $value) {
        $this->{"_".$name} = $value;
    }

    //Obtener coleccion
    public function ObtProcesos($activo=-1, $nombre="", $codigo="", $historial=-1){
        $array = array();
        $ds = new procesosDB();
        $datosBD = new datosBD();

        $result = $ds->ObtProcesosDB($activo, $nombre, $codigo, $historial);
        $array = $datosBD->arrDatosObj($result);
        return $array;
    }
    
    public function ObtProcesoPorId($id){
      $ds = new procesosDB();
      $obj = new procesosObj();
      $datosBD = new datosBD();

      $result = $ds->ObtProcesoPorIdDB($id);
      return $datosBD->setDatos($result,$obj);
    }
        
    public function GuardarProceso(){
        $objDB = new procesosDB();
        return $this->_idProceso = $objDB->InsProcesoDB($this->getParams());
    }

    public function EditarProceso(){
        $objDB = new procesosDB();
        return $objDB->ActProcesoDB($this->getParams(true));
    }

    private function getParams($ctr=false){        
        $this->_fechaCreacion = FECHAACTUAL;
        $this->_fechaAct = FECHAACTUAL;

        $param[0] = $this->_nombre;
        $param[1] = $this->_codigo;
        $param[2] = $this->_procPrincipalId;
        $param[3] = $this->_usuarioIdDueno;
        $param[4] = $this->_usuarioIdValidador;
        $param[5] = $this->_catEstatusId;
        $param[6] = $this->_descripcion;        
        $param[7] = $this->_activo;
        $param[8] = $this->_historial;
        $param[9] = $this->_version;
        $param[10] = $this->_departamentoId;
        $param[11] = $this->_codigoFormato;

        if(!$ctr){
            $param[12] = $this->_idUsuarioCmb;
            $param[13] = $this->_fechaCreacion;
        }else{
            $param[12] = $this->_idUsuarioCmb;
            $param[13] = $this->_fechaAct;
            $param[14] = $this->_idProceso;
        }

        return $param;
    }

    // //Eliminar catTiposPrecioObjs
    // public function EliminarcatTiposPrecioObj($idDatoUsuario){
    //     $objDB = new catCategoriasDB();
    //     $param[0] = $idDatoUsuario;
    //     return $objDB->deletecatTiposPrecioDB($param);
    // }

    public function ActualizarCampo($campo, $valor, $id){
        $param[0] = $campo;
        $param[1] = $valor;
        $param[2] = $id;

        $objDB = new procesosDB();
        $resAct = $objDB->ActCampoProcesoDB($param);
        return $resAct;
    }

    public function ObtProcesosGrid3($idUsuario=0, $filSel="", $filTexto="", $procPrincipalId=0){
        $array = array();
        $ds = new procesosDB();
        $datosBD = new datosBD();

        $result = $ds->ProcesosDataSet2($idUsuario, $filSel, $filTexto, $procPrincipalId);
        $array = $datosBD->arrDatosObj($result);
        return $array; 
    }

    /*private function obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $procPrincipalId, $nivel){
        // $array = array();
        $ds = new procesosDB();
        $datosBD = new datosBD();

        $result = $ds->ProcesosDataSet2($idUsuario, $filSel, $filTexto, $procPrincipalId);
        $array = $datosBD->arrDatosObj($result);

        echo "tiene: ".count($array)." - nivel: ".$nivel."<br/>";
        echo "<pre>";
        print_r($array);
        echo "</pre>";
        if(count($array)>0){
            foreach ($array as $key=>$elem){
                $nivel +=1;
                $array[$key]->{"nivel"} = $nivel;
                // $array = (array)$elem;
                // $arrayTotal[] = (array)$elem;

                echo "idPadre: ".$elem->idProceso." - ";
                $this->obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $elem->idProceso, $nivel);
            }            
        }
       // return $arrayTotal;
    }
*/
    public function ObtProcesosGrid2($array){
        // $array = array();
        // $ds = new procesosDB();
        // $datosBD = new datosBD();

        /*$result = $ds->ProcesosDataSet2($idUsuario, $filSel, $filTexto, $procPrincipalId);
        $array = $datosBD->arrDatosObj($result);
        $arrayTotal = array();*/

        // echo "es: ".count($array)."<br/>";
        // echo "<pre>";
        // print_r($array);        
        // echo "</pre>";

        /*//Obtener todos aquellos que son padres        
        if(count($array)>0){
            foreach ($array as $key=>$elem){
                $nivel = 0;
                $array[$key]->{"nivel"} = $nivel;
                // $arrayTotal[] = (array)$elem;
                $this->arrProcesos[] = (array)$elem;

                echo "idPadre: ".$elem->idProceso." - ";
                // $arrayHijos = $this->obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $elem->idProceso, $nivel);
                // if(count($arrayHijos)>0){
                //     $arrayTotal[] = $arrayHijos;
                // }
                $this->obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $elem->idProceso, $nivel);
            }
        }

        // $this->arrProcesos = array("1");
        echo "---------------------------";
        // echo "Total: ".count($arrayTotal);
        // echo "<pre>";
        // print_r($this->arrProcesos);
        // echo "</pre>";
        
        exit(); */   
            
        /*if(count($array)>0){
            foreach ($array as $key=>$elem){  
                if($elem->mo_sp_clase!=""){
                    $array[$key]->{"mo_dp_clase"} = $elem->mo_sp_clase;
                }

                //obtener el codigo de referencia
                $array[$key]->{"codReferencia"} = "";
                $datosProcesoCodRef = $this->ObtProcesoPorId($elem->procPrincipalId);
                if($datosProcesoCodRef->idProceso>0){
                    $array[$key]->{"codReferencia"} = $datosProcesoCodRef->codigo;
                }                
                $array[$key] = (array)$elem;
            }
        }*/
        
        $ds = new ArrayDataSource($array);
        $grid = new KoolGrid("procesos");

        $configGrid = new configuracionesGridObj();
        $configGrid->defineGrid($grid, $ds);
        $configGrid->defineColumn($grid, "idProceso", "ID", false, true);
        $configGrid->defineColumn($grid, "codigo", "Clave", true, false, 0, "", "150px");
        // $configGrid->defineColumn($grid, "codReferencia", "Clave Referencia", true, false, 0);
        $configGrid->defineColumn($grid, "nombre", "Nombre del proceso", true, false, 0);
        $configGrid->defineColumn($grid, "usrDueno", "Realiza", true, false, 0);
        $configGrid->defineColumn($grid, "usrValidador", "Aprueba", true, false, 0);
        $configGrid->defineColumn($grid, "fechaAct2", "&Uacute;ltima actualizaci&oacute;n", true, false, 0);
        $configGrid->defineColumn($grid, "version", "Versi&oacute;n", true, false, 0);
    
        // if($_SESSION['idRol']==1){
            $configGrid->defineColumnEdit($grid);
        // }
        //pocess grid
        $grid->Process();
        return $grid;
    }

    //Grid
    /*public function ObtProcesosGrid($idUsuario=0, $filSel="", $filTexto=""){
        $DataServices = new DataServices();
        $dbConn = $DataServices->getConnection();
        $ds = new MySQLiDataSource($dbConn);
        $uDB = new procesosDB();
        $ds = $uDB->ProcesosDataSet($ds, $idUsuario, $filSel, $filTexto);
        $grid = new KoolGrid("procesos");

        $configGrid = new configuracionesGridObj();
        $configGrid->defineGrid($grid, $ds);
        $configGrid->defineColumn($grid, "idProceso", "ID", false, true);
        $configGrid->defineColumn($grid, "codigo", "Clave", true, false, 0);
        // $configGrid->defineColumn($grid, "codReferencia", "Clave Referencia", true, false, 0);
        $configGrid->defineColumn($grid, "nombre", "Nombre del proceso", true, false, 0);
        $configGrid->defineColumn($grid, "usrDueno", "Realiz&oacute;", true, false, 0);
        $configGrid->defineColumn($grid, "usrValidador", "Aprob&oacute;", true, false, 0);
        $configGrid->defineColumn($grid, "fechaAct2", "&Uacute;ltima actualizaci&oacute;n", true, false, 0);
        $configGrid->defineColumn($grid, "version", "Versi&oacute;n", true, false, 0);
	
        // if($_SESSION['idRol']==1){
            $configGrid->defineColumnEdit($grid);
        // }
        //pocess grid
        $grid->Process();
        return $grid;
    }*/
    public function ObtProcesosHistGrid($filSel="", $filTexto="",$idRaiz=0){
        $DataServices = new DataServices();
        $dbConn = $DataServices->getConnection();
        $ds = new MySQLiDataSource($dbConn);
        $uDB = new procesosDB();
        $ds = $uDB->ProcesosHistDataSet($ds, $filSel, $filTexto, $idRaiz);
        $grid = new KoolGrid("procesosHist");
        $configGrid = new configuracionesGridObj();
        $configGrid->defineGrid($grid, $ds);
        $configGrid->defineColumn($grid, "idProceso", "ID", false, true);
        $configGrid->defineColumn($grid, "codigo", "Clave", true, false, 0);
        $configGrid->defineColumn($grid, "nombre", "Nombre del proceso", true, false, 0);
        $configGrid->defineColumn($grid, "usrDueno", "Realiza", true, false, 0);
        $configGrid->defineColumn($grid, "usrValidador", "Aprueba", true, false, 0);
        $configGrid->defineColumn($grid, "fechaAct2", "&Uacute;ltima actualizaci&oacute;n", true, false, 0);
        $configGrid->defineColumn($grid, "version", "Versi&oacute;n", true, false, 0);
        // $configGrid->defineColumn($grid, "fechaAct", "Versi&oacute;n", true, false, 0);

        // if($_SESSION['idRol']==1){
            $configGrid->defineColumnEdit($grid);
        // }

        //pocess grid
        $grid->Process();

        return $grid;
    }

}