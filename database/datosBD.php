<?php
$dirname = dirname(__DIR__);
class datosBD {
	    
    //setear datos en las variables privadas
    public function setDatos($result, $objeto=array()){    	
        $myRows = ($result)?mysqli_fetch_object($result):NULL;
        
        if($myRows == NULL)    
        {            
        	return (object)$objeto;
        }
        else
        {
        	return $myRows;
    	}
               
    }

    //Obtener coleccion de datos por fetch_object
    public function arrDatosObj($result){
        $array = array();
        
        if ($result)
        {               
            while ($myRows = mysqli_fetch_object($result)){            
                $array[] = $myRows;
            }
            mysqli_free_result($result); // Free result set        
        }
        return $array;
    }
}

    ?>