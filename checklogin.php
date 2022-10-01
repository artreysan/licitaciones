<?php
ob_start();

include_once 'brules/usuariosObj.php';

$userObj = new usuariosObj();

$usrEmail = stripslashes($_POST['usr_email']);
$usrPass = stripslashes($_POST['usr_pass']);

//verificar si existe usuario
$user = $userObj->LogInUser(trim($usrEmail), str_replace("'", "", trim($usrPass)));

if($user->idUsuario>0){

    if($user->activo>0){

        session_start();
        $_SESSION['idUsuario'] = $user->idUsuario;
        $_SESSION['idRol'] = $user->idRol;
        $_SESSION['idUnAd'] = $user->idUnAd;
        $_SESSION['myusername'] = $user->nombre;
        $_SESSION["status"] = "ok";

        if($user->idRol == 1 || $user->idRol == 2 || $user->idRol == 4 || $user->idRol == 5 || $user->idRol == 6 || $user->idRol == 7){
            header("location:admin/index.php");

        }
        // elseif ($user->idRol == 4) {
        //     header("location:cliente/index.php");
        // }
        else{
            header("location:index.php?login=error");
        }
    }

    else{
        header("location:index.php?login=inactivo");

    }
}

else{
    header("location:index.php?login=error");
}

ob_flush();

?>

