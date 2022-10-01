<?php 

$dirname = dirname(__DIR__);

include_once  $dirname.'/database/docsLicitacionesBD.php';
include_once  $dirname.'/database/datosBD.php';


class docsLicitacionesObj{
	private $_idDocLi = 0;
    private $_idUsuario = 0;
    private $_idLicitacion	 = 0;
    private $_nombreDoc	 = '';
    private $_documento = '';
    private $_publicado = 0;
    private $_fechaCreacion = '0000-00-00 00:00:00';

    //get y set
    public function __get($name) {             
        return $this->{"_".$name};
    }

    public function __set($name, $value) {        
        $this->{"_".$name} = $value;
    }

    public function GuardarDocLicitacion(){
        $objDB = new docsLicitacionesBD();
        $this->_idDocLi = $objDB->insertDocumentoDB($this->getParams());
    }

    private function getParams($update = false){                   
        $param[0] = $this->_idUsuario;
        $param[1] = $this->_idLicitacion;
        $param[2] = $this->_nombreDoc;
        $param[3] = $this->_documento;
        $param[4] = $this->_publicado;
        
        return $param;
    }

    public function obtAllDocsLicitacion($licitacionesIds = ""){
    	$array = array();
        $ds = new docsLicitacionesBD();
        $datosBD = new datosBD();
        $result = $ds->obtAllDocsLicitacionBD($licitacionesIds);
        $array = $datosBD->arrDatosObj($result);     
        return $array;
    }



}


?>