<?php

$dirname = dirname(__DIR__);

include_once  $dirname.'/database/licitacionesBD.php';
include_once  $dirname.'/database/datosBD.php';


class licitacionesObj{
	private $_idLicitacion = 0;
    private $_idUnAd = 0;
    private $_idUsuario = 0;
    private $_licitacion = '';
    private $_activo = 0;
    private $_fechaCreacion = '0000-00-00 00:00:00';

    //get y set
    public function __get($name) {             
        return $this->{"_".$name};
    }

    public function __set($name, $value) {        
        $this->{"_".$name} = $value;
    }


    public function GuardarLicitacion(){
        $objDB = new licitacionesBD();
        $this->_idLicitacion = $objDB->insertLicitacionDB($this->getParams());
    }

    private function getParams($update = false){                   
        $param[0] = $this->_idUnAd;
        $param[1] = $this->_idUsuario;
        $param[2] = $this->_licitacion;
        $param[3] = $this->_activo;
        
        return $param;
    }

    //Obtener coleccion de roles
    public function GetAllLicitaciones($licitacionesIds = ""){
        $array = array();
        $ds = new licitacionesBD();
        $datosBD = new datosBD();
        $result = $ds->GetallLicitaciones($licitacionesIds);
        $array = $datosBD->arrDatosObj($result);     
        return $array;            
    }
    

    //Obtener roles por su id
    public function obtenerLicitacionById($id){
        $ds = new licitacionesBD();
        $obj = new licitacionesObj();
        $datosBD = new datosBD();
        $result = $ds->obtenerLicitacionByIdDB($id);
        return $datosBD->setDatos($result, $obj);
    }

}


?>