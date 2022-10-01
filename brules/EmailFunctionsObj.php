<?php
/*
 *  Descripción: Functions need for sent emails
 */

$dirname = dirname(__DIR__);
include_once  $dirname.'/common/class.phpmailer.php';
include_once  $dirname.'/common/class.smtp.php';

class EmailFunctions{

    
	 //Metodo que ejecuta el envio el correo
    private function SendDataMail($subject, $email, $mailHtml){
        $sfrom = 'Monzani <tester@framelova.net>';
        $sheader= $this->GetHeader($sfrom,'');
        $res = mail($email,$subject,$mailHtml,$sheader);

        if($res!=true) {
           $statusSend = '0';
        } else {
           $statusSend = '1';
        }

        return $statusSend;
    }
  	//Header del email
  	private function GetHeader($sfrom, $bcc){
        $sheader = "From:".$sfrom."\nReply-To:".$sfrom."\n";
        if($bcc != ''){
            $sheader=$sheader.'Bcc:'.$bcc."\n";
        }
    		$sheader=$sheader."X-Mailer:PHP/".phpversion()."\n";
    		$sheader=$sheader."Mime-Version: 1.0\n";
        $sheader=$sheader."X-Priority: 3\n";
        $sheader=$sheader."X-MSMail-Priority: Normal\n";
		    $sheader=$sheader."Content-Type: text/html; charset=utf-8";        

        return $sheader;
    }

    //Metodo encargado para enviar correos usando phpmailer por SMTP
    public function EmailSmpt($email="",$nombreEmail="", $body="",$subject="",$attached=""){
      $dirname = dirname(__DIR__);
      include $dirname.'/common/config.php';

      $mail = new PHPMailer();
      $mail->CharSet = "UTF-8";
      $mail->IsSMTP(); // telling the class to use SMTP
      $mail->Host = $smtp_host; // SMTP server
      $mail->SMTPAuth = true; // enable SMTP authentication
      $mail->SMTPKeepAlive = true;
      $mail->Port = $smtp_Port; // set the SMTP port for the GMAIL server
      $mail->Username = $smtp_Username; // SMTP account username
      $mail->Password = $smtp_Password; // SMTP account password
      $mail->SMTPSecure = $smtp_SMTPSecure;
      $mail->SetFrom($email_from, $name_from);

      $mail->AddAddress($email, "");
      // $mail->AddBCC("carlos.ramirez@framelova.com", "");

      $mail->Subject = $subject;
      $mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
      $mail->MsgHTML($body);

      //adjuntar documento
      if($attached!=""){
        $mail->AddAttachment($attached); // ruta del archivo
      }

      if(!$mail->Send()) {
        $statusSend = '0';
        //$statusSend = "Mailer Error: " . $mail->ErrorInfo;
      } else {
        $statusSend = '1';
      }

      return $statusSend;
    }

    //Metodo encargado para enviar correos usando phpmailer
    public function EmailSmptNoPass($email="",$nombreEmail="", $body="",$subject="",$attached=""){
        // $body = 'haciendo pruebas sin smpt';
        $mail = new PHPMailer();
        $mail->CharSet = "UTF-8";

        // $mail->SetFrom('tester@framelova.net', 'Monzani');
        $mail->SetFrom('tester@framelova.net', 'Monzani');
        // $mail->AddReplyTo("carlos.ramirez@framelova.com", "Monzani");

        $mail->AddAddress($email, "");
        // $mail->AddBCC("carlos.ramirez@framelova.com", "");

        $mail->Subject = $subject;
        $mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
        $mail->MsgHTML($body);

        //adjuntar documento
        if($attached!=""){
          $mail->AddAttachment($attached); // ruta del archivo
        }

        if(!$mail->Send()) {
            $statusSend = '0';
          } else {
            $statusSend = '1';
          }

        return $statusSend;
    }

    //Metodo encargado para enviar correos usando phpmailer
    public function EmailSmptNoPassCustom($email="",$nombreEmail="", $body="",$subject="",$attached="", $nameServer="", $emailServer=""){      
        if($nameServer!=""){
          $nameServer = $nameServer;
        }else{
          $nameServer = "Monzani";
        }
        if($emailServer!=""){
          $emailServer = $emailServer;
        }else{
          $emailServer = "tester@framelova.net";
        }

        $mail = new PHPMailer();
        $mail->CharSet = "UTF-8";
        $mail->SetFrom($emailServer, $nameServer);        
        // $mail->AddReplyTo("carlos.ramirez@framelova.com", "Monzani");
        
        $mail->AddAddress($email, "");
        // $mail->AddBCC("carlos.ramirez@framelova.com", "");        
        $mail->Subject = $subject;
        $mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
        $mail->MsgHTML($body);

        //adjuntar documento
        if($attached!=""){
          //Para los videos
          /*
          $arrMimetypes = array("mov"=>"video/quicktime", "mp4"=>"video/mp4");
          $archivoExt = strtolower(pathinfo(basename($attached),PATHINFO_EXTENSION));
          if($archivoExt=="mov" || $archivoExt=="mp4"){
            echo "Entre--";
            $mail->AddAttachment($attached, "", "", $arrMimetypes[$archivoExt]);
          }else{
            $mail->AddAttachment($attached); // ruta del archivo
          }
          */
          $mail->AddAttachment($attached); // ruta del archivo
        }

        if(!$mail->Send()) {
            $statusSend = '0';
          } else {
            $statusSend = '1';
          }

        return $statusSend;
    }


     //>>>>>>>>METODOS ENCARGADOS PARA CONTRUIR Y ENVIAR EL CORREO


    
    public function EnviarDatosDeAcceso($email, $nombreUsuario, $passCliente)
    {
      $subject = 'Datos de acceso';
      $mailHtml = $this->datosAccesoMailBody2($nombreUsuario, $email, $passCliente);
      // echo $mailHtml;
      // $resMail =  $this->EmailSmptNoPass($email, $nombreUsuario, $mailHtml, $subject, "");
      $resMail =  $this->EmailSmpt($email, $nombreUsuario, $mailHtml, $subject, ""); //HABILITAR
      // $resMail = 1;//DESHABILITAR
      return $resMail;//HABILITAR
      // return $mailHtml;//DESHABILITAR
    }

    public function RecuperarDatosDeAcceso($email, $nombreUsuario, $passCliente)
    {
      $subject = 'Recuperar contraseña';
      $mailHtml = $this->recuperarDatosAccesoMailBody($nombreUsuario, $email, $passCliente);      
      $resMail =  $this->EmailSmptNoPass($email, $nombreUsuario, $mailHtml, $subject, "");
      // echo $mailHtml;
      return $resMail;
    }
    

    public function EnviarCodigo($subject, $email, $codigo)
    {
      // $email = "jair.castaneda@framelova.com";
      $mailHtml = $this->EnviarCodigoBody($codigo);
      // echo $mailHtml;
      $resMail =  $this->SendDataMail($subject, $email, $mailHtml);//HABILITAR
      // $resMail = 1;//DESHABILITAR
      return $resMail;
    }

    public function EnviarDatosAcceso($subject, $email, $password)
    {
     // $email = "jair.castaneda@framelova.com";
     $mailHtml = $this->EnviarDatosAccesoBody($email, $password);
     // echo $mailHtml;
      // die();
     // $resMail =  $this->SendDataMail($subject, $email, $mailHtml);//HABILITAR
      // $resMail = 1;//DESHABILITAR
     return $resMail;
    }

   //Enviar buzon ciudadano 
    public function enviarBuzonCiudadano($subject, $email, $datos, $archivo)
    {
      $mailHtml = $this->enviarBuzonCiudadanoBody($datos, $subject, $archivo);
      // echo $mailHtml;          
      $resMail = $this->EmailSmptNoPassCustom($email, "", $mailHtml, $subject, $archivo); 
      return $resMail;
    }

    //Solicitar nueva contrasenia
    public function reseteoContrasenia($email, $nombreUsuario, $idUsuario)
    {
      $subject = 'Solicitar contraseña';
      $mailHtml = $this->reseteoContraseniaMailBody($nombreUsuario, $email, $idUsuario);      
      // echo $mailHtml;
      $resMail =  @$this->SendDataMail($subject, $email, $mailHtml);
      // return 1;
      return $resMail;
    }
    
    // Enviar pdf de la grafica y el detalle
    public function EnviarPdfGrafica($subject, $email, $datos)
    {
      $mailHtml = $this->EnviarPdfGraficaBody($datos);
      // echo $mailHtml;
      $resMail =  $this->EmailSmptNoPass($email, "", $mailHtml, $subject, $datos->adjunto);      
      return $resMail;
    }

    public function EnviarGenerico($subject, $email, $titulo, $mensaje, $nombreApp = "Monzani", $aux = "", $showNoReplay = true)
    { 
      //$email = "jair.castaneda@framelova.com";//DESHABILITAR
      $mailHtml = $this->enviarGenericoBody($titulo, $mensaje, $nombreApp, $aux, $showNoReplay);      
      // $resMail =  $this->SendDataMail($subject, $email, $mailHtml);//HABILITAR
      $resMail = 1;//DESHABILITAR
      return $resMail;          
    }


    // Enviar correo al validador
    public function EnviarCorreoValidador($subject, $email, $datos){
      $mailHtml = $this->EnviarCorreoValidadorBody($datos);
      // echo $mailHtml;
      $resMail =  $this->EmailSmptNoPass($email, "", $mailHtml, $subject);
      return $resMail;
    }

    // Enviar correo al duenio del proceso
    public function EnviarCorreoDuenio($subject, $email, $datos){
      $mailHtml = $this->EnviarCorreoDuenioBody($datos);
      // echo $mailHtml;
      $resMail =  $this->EmailSmptNoPass($email, "", $mailHtml, $subject);
      return $resMail;
    }

    // Imp. 25/08/20
    // Enviar propuesta en pdf
    public function EnviarPropuestaPdf($subject, $email, $datos){
      $mailHtml = $this->EnviarPdfPropuestaBody($datos);
      // echo $mailHtml;
      $resMail =  $this->EmailSmpt($email, "", $mailHtml, $subject, $datos->adjunto);
      // $resMail =  $this->EmailSmptNoPassCustom($email, "", $mailHtml, $subject, $datos->adjunto);
      return $resMail;//HABILITAR
    }

    //>>>>>>>>CUERPOS HTML

    //Correo al validador
    private function EnviarCorreoValidadorBody($datos){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';

        $html = '<html><body>';
          
            $html .= '<table style="width:600px;" >';            
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="padding: 10px;">Estimado <b>'.$datos->nombre.'</b>, se te ha asignado un proceso para validar:</td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td width="230"><b>Clave:</b></td>';
                  $html .= '<td>'.$datos->clave.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Nombre proceso</b></td>';
                  $html .= '<td>'.$datos->nombreproceso.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Realizo</b></td>';
                  $html .= '<td>'.$datos->nombrerealizo.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Versi&oacute;n</b></td>';
                  $html .= '<td>'.$datos->version.'</td>';
                $html .= '</tr>';

                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';              
                $html .= '<tr>';
                  $html .= '<td colspan="2"><a href="'.$siteURL.'">Da click aqu&iacute; para ir al sistema</a></td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tfoot>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="font-size: 12px; margin-top: 30px;">Este mensaje es enviado de forma automática favor de no responder.</td>';
                $html .= '</tr>';
              $html .= '</tfoot>';
            $html .= '</table>';

        $html .= '</body></html>';

        return $html;
    }

    //Correo al duenio
    private function EnviarCorreoDuenioBody($datos){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';

        $html = '<html><body>';
          
            $html .= '<table style="width:600px;" >';            
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="padding: 10px;">Estimado <b>'.$datos->nombre.'</b>, el proceso que dio de alta ha sido revisado y fue marcado como <b>'.$datos->nombreEstatus.'</b></td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td width="230"><b>Clave:</b></td>';
                  $html .= '<td>'.$datos->clave.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Nombre proceso</b></td>';
                  $html .= '<td>'.$datos->nombreproceso.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Versi&oacute;n</b></td>';
                  $html .= '<td>'.$datos->version.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Validador</b></td>';
                  $html .= '<td>'.$datos->nombreaprobo.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Comentario</b></td>';
                  $html .= '<td>'.$datos->comentario.'</td>';
                $html .= '</tr>';

                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';              
                $html .= '<tr>';
                  $html .= '<td colspan="2"><a href="'.$siteURL.'">Da click aqu&iacute; para ir al sistema</a></td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tfoot>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="font-size: 12px; margin-top: 30px;">Este mensaje es enviado de forma automática favor de no responder.</td>';
                $html .= '</tr>';
              $html .= '</tfoot>';
            $html .= '</table>';

        $html .= '</body></html>';

        return $html;
    }

    private function enviarGenericoBody($titulo, $mensaje, $nombreApp, $aux, $showNoReplay){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      // $segObj = new seguridadObj();
      // $param1 = $segObj->encriptarCadena('param1='.$idUsuario);
      $mensaje = str_replace("../upload", $siteURL."upload", $mensaje);

        $html = '<html><body>';
            $html .= '<table style="width:600px;" >';
                $html .= "<tbody>";
                $html .= '<tr><td><img src="'.$siteURL.'images/banner_correo.jpg?upd=1" style="width: 100%;"></td></tr>';
                   if($showNoReplay){
                      $html .= "<tr>";
                       $html .= '<td style="padding: 10px;">Le informamos que ha recibido una notificaci&oacute;n de '.$nombreApp.' .</td>';
                      $html .= "</tr>";
                    }
                   $html .= "<tbody>";
                   $html .= "<tr>";
                       $html .= '<td style="padding: 10px;">
                                   '.$titulo.' <br> '.$mensaje.'
                                </td>';
                   $html .= "</tr>";
                $html .= "</tbody>";
                if($showNoReplay){
                  $html .= "<tfoot>";
                      $html .= "<tr>";
                          $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma autom&aacute;tica favor de no responder.</td>';
                      $html .= "</tr>";
                  $html .= "</tfoot>";
                }
            $html .= '</table>';
        $html .= '</body></html>';
        return $html;
    }


  //Cuerpo generico para correos de Codigo
   private function EnviarCodigoBody($codigo){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      // $segObj = new seguridadObj();
      // $param1 = $segObj->encriptarCadena('param1='.$idUsuario);
        $html = '<html><body style="background:white;">';
            $html .= '<table style="width:600px;" >';
                $html .= "<tbody>";                
                // $html .='<tr><img src="'.$siteURL.'/images/logo.png" width="80" /></tr>';
                   $html .= "<tr>";
                       $html .= '<td style="padding: 10px;"><h3>C&oacute;digo de verificaci&oacute;n</h3></td>';
                   $html .= "</tr>";
                   $html .= "<tbody>";
                   $html .= "<tr>";
                       $html .= '<td style="padding: 10px;">
                                  Para validar su cuenta introduzca este c&oacute;digo en el campo de la aplicaci&oacute;n<br>
                                  <b>'.$codigo.'</b>
                                </td>';
                   $html .= "</tr>";
                $html .= "</tbody>";
                $html .= "<tfoot>";
                    $html .= "<tr>";
                        $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma autom&aacute;tica favor de no responder.</td>';
                    $html .= "</tr>";
                $html .= "</tfoot>";
            $html .= '</table>';
        $html .= '</body></html>';
        return $html;
    }

    //Cuerpo generico para correos de Datos de acceso
    private function EnviarDatosAccesoBody($correo, $password){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      // $segObj = new seguridadObj();
      // $param1 = $segObj->encriptarCadena('param1='.$idUsuario);

       $html = '<html><body style="background:white;">';
            $html .= '<table style="width:600px;" >';               
                $html .= "<tbody>";
               $html .='<tr><img src="../images/logo--.png" /></tr>';
                   $html .= "<tr>";  
                      $html .= '<td style="padding: 10px;"><h3>Datos de Acceso a su Cuenta</h3></td>';
                   $html .= "</tr>";      
                   $html .= "<tbody>";
                   $html .= "<tr>";  
                       $html .= '<td style="padding: 10px;">
                                 Correo: '.$correo.'
                               </td>';
                      $html .= '<td style="padding: 10px;">
                                 Contraseña: '.$password.'
                                </td>';                       
                   $html .= "</tr>";      
                $html .= "</tbody>";
                $html .= "<tfoot>";
                    $html .= "<tr>";
                        $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma automática favor de no responder.</td>';
                    $html .= "</tr>"; 
                $html .= "</tfoot>";
            $html .= '</table>';        
        $html .= '</body></html>';
        return $html;
    }
    
    //Html para recuperar datos de acceso
    private function recuperarDatosAccesoMailBody($nombre, $email, $password){
        $html = '<html><body>';
           
          $html .= '<table style="width:600px;" >';            
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="padding: 10px;">Estimado <b>'.$nombre.'</b>, recibimos su solicitud de recuperación de contraseña. tus datos de acceso a la aplicación son:</td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td width="115"><b>E-mail:</b></td>';
                  $html .= '<td width="475">'.$email.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Contraseña</b></td>';
                  $html .= '<td>'.$password.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td colspan="2"><p>Una vez iniciado sesión podrás cambiar tu contraseña <br/> en la sección de perfil.</p></td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tfoot>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="font-size: 12px; margin-top: 30px;">Este mensaje es enviado de forma automática favor de no responder.</td>';
                $html .= '</tr>';
              $html .= '</tfoot>';
          $html .= '</table>';

        $html .= '</body></html>';
        return $html;
    }

    private function datosAccesoMailBody($nombre, $email, $password){
        $html = '<html><body>';
          
            $html .= '<table style="width:600px;" >';            
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="padding: 10px;">Estimado <b>'.$nombre.'</b>, tus datos de acceso a la aplicación de Monzani son los siguientes, gracias por su preferencia:</td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tbody>';
                $html .= '<tr>';
                  $html .= '<td width="115"><b>E-mail:</b></td>';
                  $html .= '<td width="475">'.$email.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td><b>Contraseña</b></td>';
                  $html .= '<td>'.$password.'</td>';
                $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';
                // $html .= '<tr>';
                //   $html .= '<td colspan="2"><p>Una vez iniciado sesión podrás cambiar tu contraseña <br/> en la sección de perfil.</p></td>';
                // $html .= '</tr>';
                $html .= '<tr>';
                  $html .= '<td colspan="2">&nbsp;</td>';
                $html .= '</tr>';
              $html .= '</tbody>';
              $html .= '<tfoot>';
                $html .= '<tr>';
                  $html .= '<td colspan="2" style="font-size: 12px; margin-top: 30px;">Este mensaje es enviado de forma automática favor de no responder.</td>';
                $html .= '</tr>';
              $html .= '</tfoot>';
            $html .= '</table>';

        $html .= '</body></html>';

        return $html;
    }

    function datosAccesoMailBody2($nombre, $email, $password){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      $html = '';

      $html .= '<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta charset="utf-8"> <!-- utf-8 works for most cases -->
          <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldnt be necessary -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
          <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
          <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
      
          <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
      
          <!-- CSS Reset : BEGIN -->
          <style>
      
              /* What it does: Remove spaces around the email design added by some email clients. */
              /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
              html,
      body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
      }
      
      /* What it does: Stops email clients resizing small text. */
      * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }
      
      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
          margin: 0 !important;
      }
      
      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
      }
      
      /* What it does: Fixes webkit padding issue. */
      table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
      }
      
      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
          -ms-interpolation-mode:bicubic;
      }
      
      /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
      a {
          text-decoration: none;
      }
      
      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
      .unstyle-auto-detected-links *,
      .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
      
      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
          display: none !important;
          opacity: 0.01 !important;
      }
      
      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
          color: inherit !important;
      }
      
      /* If the above doesnt work, add a .g-img class to any image in question. */
      img.g-img + div {
          display: none !important;
      }
      
      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size youd like to fix */
      
      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u ~ div .email-container {
              min-width: 320px !important;
          }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u ~ div .email-container {
              min-width: 375px !important;
          }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
          u ~ div .email-container {
              min-width: 414px !important;
          }
      }
      
          </style>
      
          <!-- CSS Reset : END -->
      
          <!-- Progressive Enhancements : BEGIN -->
          <style>
      
            .primary{
        background: #30e3ca;
      }
      .bg_white{
        background: #ffffff;
      }
      .bg_light{
        background: #fafafa;
      }
      .bg_black{
        background: #000000;
      }
      .bg_dark{
        background: rgba(0,0,0,.8);
      }
      .email-section{
        padding:2.5em;
      }
      
      /*BUTTON*/
      .btn{
        padding: 10px 15px;
        display: inline-block;
      }
      .btn.btn-primary{
        border-radius: 5px;
        background: #30e3ca;
        color: #ffffff;
      }
      .btn.btn-white{
        border-radius: 5px;
        background: #ffffff;
        color: #000000;
      }
      .btn.btn-white-outline{
        border-radius: 5px;
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
      }
      .btn.btn-black-outline{
        border-radius: 0px;
        background: transparent;
        border: 2px solid #000;
        color: #000;
        font-weight: 700;
      }
      
      h1,h2,h3,h4,h5,h6{
        font-family: "Lato", sans-serif;
        color: #000000;
        margin-top: 0;
        font-weight: 400;
      }
      
      body{
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 17px;
        line-height: 1.8;
        color: rgba(0,0,0,.4);
      }
      
      a{
        color: #30e3ca;
      }
      
      table{
      }
      /*LOGO*/
      
      .logo h1{
        margin: 0;
      }
      .logo h1 a{
        color: #30e3ca;
        font-size: 24px;
        font-weight: 700;
        font-family: "Lato", sans-serif;
      }
      
      /*HERO*/
      .hero{
        position: relative;
        z-index: 0;
      }
      
      .hero .text{
        color: #798693;
      }
      .hero .text h2{
        color: #000;
        font-size: 40px;
        margin-bottom: 0;
        font-weight: 400;
        line-height: 1.4;
      }
      .hero .text h3{
        font-size: 24px;
        font-weight: 300;
      }
      .hero .text h2 span{
        font-weight: 600;
        color: #30e3ca;
      }
      
      
      /*HEADING SECTION*/
      .heading-section{
      }
      .heading-section h2{
        color: #000000;
        font-size: 28px;
        margin-top: 0;
        line-height: 1.4;
        font-weight: 400;
      }
      .heading-section .subheading{
        margin-bottom: 20px !important;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(0,0,0,.4);
        position: relative;
      }
      .heading-section .subheading::after{
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        content: "";
        width: 100%;
        height: 2px;
        background: #30e3ca;
        margin: 0 auto;
      }
      
      .heading-section-white{
        color: rgba(255,255,255,.8);
      }
      .heading-section-white h2{
        font-family: 
        line-height: 1;
        padding-bottom: 0;
      }
      .heading-section-white h2{
        color: #ffffff;
      }
      .heading-section-white .subheading{
        margin-bottom: 0;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(255,255,255,.4);
      }
      
      
      ul.social{
        padding: 0;
      }
      ul.social li{
        display: inline-block;
        margin-right: 10px;
      }
      
      /*FOOTER*/
      
      .footer{
        border-top: 1px solid rgba(0,0,0,.05);
        color: rgba(0,0,0,.5);
      }
      .footer .heading{
        color: #000;
        font-size: 20px;
      }
      .footer ul{
        margin: 0;
        padding: 0;
      }
      .footer ul li{
        list-style: none;
        margin-bottom: 10px;
      }
      .footer ul li a{
        color: rgba(0,0,0,1);
      }
      
      
      @media screen and (max-width: 500px) {
      
      
      }
      
      
          </style>
      
      
      </head>
      
      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
        <center style="width: 100%; background-color: #f1f1f1;">
          <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="logo" style="text-align: center;">
                        <h1><a href="https://monzaniweb.framelova.info/">Monzani Body Clinic</a></h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr><!-- end tr -->
              <tr>
                <td valign="middle" class="hero bg_white" style="padding: 3em 0 2em 0;">
                  <img src="'.$siteURL.'/images/logo.jpg" alt="" style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
                </td>
              </tr><!-- end tr -->
              <tr>
                <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;">
                  <table>
                    <tr>
                      <td>
                        <div class="text" style="padding: 0 2.5em; text-align: center;">
                          <p>Estimado <b>'.$nombre.'</b>, tus datos de acceso a la aplicación de Monzani son los siguientes, gracias por su preferencia:</p>
                          <p><b>Email</b>: '.$email.'</p>
                          <p><b>Email:</b> '.$password.'</p>
                          <p>A continuación se muestran los enlaces para descargar la aplicacion:</p>
                          <p><a href="https://play.google.com/store/apps/details?id=com.framelova.monzani" class="btn btn-primary" target="_blank"><img src="'.$siteURL.'/images/email/playstore.png" width="200px"></a></p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr><!-- end tr -->
            <!-- 1 Column Text + Button : END -->
            </table>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td valign="middle" class="bg_light footer email-section">
                  <table>
                    <tr>
                      <td valign="top" width="100%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-right: 10px;">
                              <h3 class="heading">Sobre nosotros</h3>
                              <p>Somos el mejor centro de estética corporal y facial especializados en lipoescultura sin cirugía y tratamientos reductivos para corregir celulitis.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <!--<td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                              <h3 class="heading">Contact Info</h3>
                              <ul>
                                <li><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
                                <li><span class="text">+2 392 3929 210</span></a></li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-left: 10px;">
                              <h3 class="heading">Useful Links</h3>
                              <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Work</a></li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>-->
                    </tr>
                  </table>
                </td>
              </tr><!-- end: tr -->
              <tr>
                <td class="bg_light" style="text-align: center;">
                  <p>Este mensaje es enviado de forma automática favor de no responder.</p>
                </td>
              </tr>
            </table>
      
          </div>
        </center>
      </body>
      </html>';

      return $html;

    }


    //Cuerpo del correo buzon ciudadano
    private function enviarBuzonCiudadanoBody($arrDatos, $subject, $archivo=""){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      
      $opc_anonimo_bc = $arrDatos->opc_anonimo_bc;
      // $tipo_contacto_bc = $arrDatos->tipo_contacto_bc; //Subjet
      $mensaje_bc = $arrDatos->mensaje_bc;  //mensaje
      $opc_testigo_bc = (count($arrDatos->opc_testigo_bc)>0)?"Si":"No";
      $nombre_bc = $arrDatos->nombre_bc;  //Nombre cuidadano
      $telefono_bc = $arrDatos->telefono_bc;  //tel cuidadano
      $opc_segdenuncia_bc = (count($arrDatos->opc_segdenuncia_bc)>0)?"Si":"No";

      //Para cuando lleva un video
      $archivoExt = strtolower(pathinfo(basename($archivo),PATHINFO_EXTENSION));
      $video = "";
      if($archivoExt=="mov" || $archivoExt=="mp4"){
          $archivoExpl = explode("testsites/", $archivo);          
          $video = $siteURL.$archivoExpl[1];
      }      
    
      $html = '<html><body style="background:white;">';
          $html .= '<table style="width:600px;" >';
              $html .= "<tbody>";
                 // $html .='<tr><img src="'.$siteURL.'/images/logo.png" width="80" /></tr>';
                 $html .= "<tr>";
                     $html .= '<td style="padding: 10px;"><h3>Reporte buz&oacute;n ciudadano: '.$subject.'</h3></td>';
                 $html .= "</tr>";
                 $html .= "<tbody>";
                 $html .= "<tr>";
                     $html .= '<td style="padding: 10px;">
                                 <div><b>Mensaje:</b> '.$mensaje_bc.'</div> 
                                 <div><b>Fue testigo:</b> '.$opc_testigo_bc.'</div> 
                                 <div>';

                                  if(count($opc_anonimo_bc)==0){
                                    $html .= '<div><b>Nombre:</b> '.$nombre_bc.'</div>';
                                    $html .= '<div><b>Tel&eacute;fono:</b> '.$telefono_bc.'</div>';
                                    $html .= '<div><b>Seguimiento a su denuncia:</b> '.$opc_segdenuncia_bc.'</div>';
                                  } 
                                  //ruta del video  
                                  if($video!=""){
                                    $html .= '<div><b>Video:</b> <a href="'.$video.'">Descargar</a></div>';
                                      // $html .= '<video width="320" height="240" controls>';
                                      //   $html .= '<source src="'.$video.'" type="video/mp4">';
                                      //   $html .= '<source src="'.$video.'" type="video/ogg">';
                                      //   $html .= '<source src="'.$video.'" type="video/quicktime">';
                                      //   $html .= 'Your browser does not support the video tag.';
                                      // $html .= '</video>';
                                  }
                        $html .= '</div>
                              </td>';
                 $html .= "</tr>";
              $html .= "</tbody>";
              $html .= "<tfoot>";
                  $html .= "<tr>";
                      $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma autom&aacute;tica favor de no responder.</td>';
                  $html .= "</tr>";
              $html .= "</tfoot>";
          $html .= '</table>';
      $html .= '</body></html>';
      return $html;
    }


    //Html para correo de datos de acceso
    private function reseteoContraseniaMailBody($nombre, $email, $idUsuario){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';
      $segObj = new seguridadObj();
      $param1 = $segObj->encriptarCadena('param1='.$idUsuario);

        $html = '<html><body>';
            $html .= '<table style="width:600px;" >';               
                $html .= "<tbody>";
                   $html .= "<tr>";  
                       $html .= '<td style="padding: 10px;">Estimado '.$nombre.' recibimos su solicitud de recuperacion de contraseña.</td>';                       
                   $html .= "</tr>";      
                   $html .= "<tbody>";
                   $html .= "<tr>";  
                       $html .= '<td style="padding: 10px;">
                                    Da clic en el siguiente enlace para recibir una nueva contraseña <a href="'.$siteURL.'extras/recuperar_contrasena.php?'.$param1.'">'.$siteURL.'extras/recuperar_contrasena.php?'.$param1.'</a> <br/>
                                    Si el enlace no funciona, puedes copiar y pegar la dirección URL en tu navegador. <br/><br/>
                                    Si usted no ha solicitado la recuperación de su contraseña haga caso omiso de este correo.<br/>
                                    Saludos.
                                </td>';                       
                   $html .= "</tr>";      
                $html .= "</tbody>";
                $html .= "<tfoot>";
                    $html .= "<tr>";
                        $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma automática favor de no responder.</td>';
                    $html .= "</tr>"; 
                $html .= "</tfoot>";
            $html .= '</table>';        
        $html .= '</body></html>';
        return $html;
    }

    
    //Cuerpo para enviar el pedido de venta de auto
    private function EnviarPdfGraficaBody($datos){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';

      // <br/> si no lo puede ver copie y pegue esta ruta '.$datos->rutaAbsAdjunto.' 
      //Estilo  
      $cssTable = "border-collapse: collapse;border: 1px solid black;";
      $cssLogo = "display: inline-block;width: 20%;vertical-align: middle;";
      $cssTituloCot = "display: inline-block;font-size: x-large;font-weight: 600;";    

        $html = '<html><body>'; 

              $html .= '<div>';
                $html .= '<div style="'.$cssLogo.'"><img src="'.$siteURL.'images/logo.jpg" height="80"></div>';
                $html .= '<div style="'.$cssTituloCot.'">Resultados del comparador</div>';
              $html .= '</div>';
              $html .= '<br/>';

              $html .= '<div>';
                $html .= '<div>Hola has recibido el archivo adjunto con la gr&aacute;fica y el detalle del comparador de medicamentos:</div>';
              $html .= '</div>';
              $html .= '<br/>';

               $html .= '<table style="width:600px;" >';
                $html .= "<tfoot>";
                    $html .= "<tr>";
                        $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma automática favor de no responder.</td>';
                    $html .= "</tr>";
                $html .= "</tfoot>";
              $html .= '</table>';
        $html .= '</body></html>';
        return $html;
    }

    // Imp. 25/08/20
    //Cuerpo para enviar el pedido de venta de auto
    private function EnviarPdfPropuestaBody($datos){
      $dirname = dirname(__DIR__);
      include  $dirname.'/common/config.php';

      // <br/> si no lo puede ver copie y pegue esta ruta '.$datos->rutaAbsAdjunto.'
      //Estilo
      $cssTable = "border-collapse: collapse;border: 1px solid black;";
      $cssLogo = "display: inline-block;width: 20%;vertical-align: middle;";
      $cssTituloCot = "display: inline-block;font-size: x-large;font-weight: 600;";

        $html = '<html><body>';

              $html .= '<div>';
                $html .= '<div style="'.$cssLogo.'"><img src="'.$siteURL.'images/logo.jpg" height="80"></div>';
                $html .= '<div style="'.$cssTituloCot.'">Propuesta del tratamiento</div>';
              $html .= '</div>';
              $html .= '<br/>';

              $html .= '<div>';
                $html .= '<div>Hola has recibido el archivo adjunto de la propuesta, <br/> si no lo puede ver copie y pegue esta ruta en su navegador '.$datos->rutaAbsAdjunto.'</div>';
              $html .= '</div>';
              $html .= '<br/>';

               $html .= '<table style="width:600px;" >';
                $html .= "<tfoot>";
                    $html .= "<tr>";
                        $html .= '<td style="font-size: 12px; margin-top: 30px;"><br/>Este mensaje es enviado de forma automática favor de no responder.</td>';
                    $html .= "</tr>";
                $html .= "</tfoot>";
              $html .= '</table>';
        $html .= '</body></html>';
        return $html;
    }
}
