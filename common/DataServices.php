<?php

class DataServices{
	//properties declarations
	private $m_HostName;
	private $m_UserNameDB;
	private $m_PasswordDB;
	private $m_DatabaseName;
	private $m_QueriesXML;
	private $connectionStatus;

	//construct
	function __construct() {
		$this->OpenConnection();
	}

	public function getConnection(){
		return $this->connectionStatus;
	}


	//method declaration
	public function getProperties(){
            include 'config.php';

            $this->m_HostName = $cfg_server;
            $this->m_UserNameDB = $cfg_user;
            $this->m_PasswordDB = $cfg_pw;
            $this->m_DatabaseName = $cfg_db;

	 }
	public function OpenConnection(){
		if (!$this->connectionStatus){
			//Load Properties
			$this->getProperties();
			// Connect to server and select databse.
			//$this->connectionStatus = mysql_connect($this->m_HostName, $this->m_UserNameDB, $this->m_PasswordDB)or die("cannot connect");
                        $this->connectionStatus = mysqli_connect($this->m_HostName, $this->m_UserNameDB, $this->m_PasswordDB, $this->m_DatabaseName);

                        mysqli_query($this->connectionStatus, "SET NAMES 'utf8'");
                        //if ($this->connectionStatus)
			//	mysql_select_db($this->m_DatabaseName) or die("cannot connect ".mysql_error());

                        if (mysqli_connect_errno()){
                            echo "cannot connect ". mysqli_connect_error();
                        }

			//Open Queries' XML
			$this->OpenXML();
		}
	}


	public function CloseConnection(){
		//Close connection
		mysqli_close($this->connectionStatus);
	}


	public function OpenXML(){
		//Open the XML Queries
		if (file_exists('../common/CommandServices.xml')) {
			$xmlDoc = simplexml_load_file("../common/CommandServices.xml") ;
		}
		else{
			$xmlDoc = simplexml_load_file("common/CommandServices.xml") ;
		}


	 	$this->m_QueriesXML = $xmlDoc ;
	}

	private function validaParams($params){
		$retParams = array();
		if ($params == NULL)
			return $params;
		foreach ($params as $param) {
			$retParams[] = str_replace("?","&quest;", $param);
		}
		return $retParams;
	}

	public function Execute($queryName, $param, $id = FALSE, $up = FALSE){
		//verify if the db is open.
		if (!$this->connectionStatus)
			$this->OpenConnection();

		//Get the correct query according the parameter
		$query = "Command[@id='$queryName']/query";
		$node = $this->m_QueriesXML->xpath($query) ;
		$queryStr = (string)$node[0];

		//Clean query
		$this->CleanQuery($queryStr);

		$param = $this->validaParams($param);

		//Replace the $param with the ones given in the paramater set
		$queryStr = $this->ReplaceParam($param, $queryStr);

 //echo $queryStr.'<br/><br/>';
		//Execute query
		$result =  mysqli_query($this->connectionStatus,$queryStr);

		/*Registra error de sql*/
		if(!$result){
			$dateByZone = new DateTime("now", new DateTimeZone('America/Mexico_City') );
       			$dateTime = $dateByZone->format('d m Y H:i:s'); //fecha Actual
			// echo mysqli_error($this->connectionStatus);
			if(!file_exists("log_sql.txt"))
			{
				$file = fopen("log_sql.txt", "w");
				fclose($file);
			}
			$file = fopen("log_sql.txt", "a");
			fwrite($file, $dateTime.": ".mysqli_error($this->connectionStatus) . PHP_EOL);
			fwrite($file, "-- Query name: ".$queryName . PHP_EOL);
			fwrite($file, "-- Query str: ".$queryStr . PHP_EOL. PHP_EOL);
			fclose($file);
		}

		if ($id == TRUE)
		   $result = mysqli_insert_id($this->connectionStatus);

                if ($up == TRUE)
		   $result = mysqli_affected_rows($this->connectionStatus);

		return $result;
	}

        /***
         * This function execute a query, but it don't open or close the connection
         * it should be done by the method that invoke
         */
        public function ExecuteNoOpen($queryName, $param)
	{
		//Get the correct query according the parameter
		$query = "Command[@id='$queryName']/query";
		$node = $this->m_QueriesXML->xpath($query) ;
		$queryStr = (string)$node[0];

		//Clean query
		$this->CleanQuery($queryStr);

		//Replace the $param with the ones given in the paramater set
		$queryStr = $this->ReplaceParam($param, $queryStr);

		//Execute query
		$result =  mysqli_query($this->connectionStatus,$queryStr);

		return $result;
	}

	public function ExecuteOnly($queryStr)
	{
		//verify if the db is open.
		if (!$this->connectionStatus)
			$this->OpenConnection();

		//Execute query
		$result =  mysqli_query($this->connectionStatus,$queryStr);
		return $result;
	}

	public function getQueryString($queryName)
	{
		//verify if the xml file is open.
		if (!$this->m_QueriesXML)
                    $this->OpenXML();


		//Get the correct query according the parameter
		$query = "Command[@id='$queryName']/query";
		$node = $this->m_QueriesXML->xpath($query) ;
		$queryStr = (string)$node[0];
		//Clean query
		$this->CleanQuery($queryStr);

		return $queryStr;
	}

        //get the Query String
	public function ExecuteDS ($queryName, $params)
	{
		//verify if the xml file is open.
		if (!$this->m_QueriesXML)
                    $this->OpenXML();
//echo $queryName."<br>";
		//Get the correct query according the parameter
		$query = "Command[@id='$queryName']/query";
		$node = $this->m_QueriesXML->xpath($query) ;

		$queryStr = (string)$node[0];
//echo $queryStr.'<br/>';
		$this->CleanQuery($queryStr);
		
		//Replace the $param with the ones given in the paramater set
		$queryStr = $this->ReplaceParam($params, $queryStr);

		return $queryStr;

	}

	public function CleanQuery($query)
	{
		//just in case, the xml got changed. "&lt;" = <
		if (strchr("&lt;", $query))
			str_ireplace("&lt;", "<",$query );
		//just in case, the xml got changed. "&gt;" = >
		if (strchr("&gt;", $query))
			str_ireplace("&gt;", ">",$query );
	}

	public function ReplaceParam($param, $query)
	{
		//if there are no params, do nothing.
		if ($param == NULL)
			return $query;
		/*if (count($param) == 0)
			return $query;*/

		//change the "?" for the actual param set in the array
		foreach ($param as $value)
		{
			//intialize variables
			$pos= 0;
			$count = 0;
			//just in case, the param has "?"
			str_ireplace("?","##@##",$value);
			//just in case, the param has double quote " "" "
			str_ireplace("'","\"",$value);

			//calculations to replace the params in the query
			$pos = strpos($query, "?");
			$count = strlen($query);
			$countValue = strlen($value);

			//replace the param in the query
			$query = substr_replace($query, $value, $pos, -($count-($pos-1)) );
			$count = strlen($query);
			$pos = strpos($query, "?");

			//delete the "?" in the query
			$query = substr_replace($query, "", $pos, -($count-($pos+1)) );


		}
		//delete "?" at the end of the query
		$query = str_ireplace("?"," ",$query);

		//replace the ? in the param with its actual value.
		str_ireplace("##@##","?", $query);

		return $query;

	}
}

?>
