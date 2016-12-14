<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
	if ($_POST['idstamp']=="qTJCcIFvx/eywnxCTDYn29On0LxrmcFxvnAMNy5obAU=") {
		$para      = 'blackspiral@live.com';
		$titulo    = 'Contacto - Portafolio web.';
		$mensaje = 'Nombre: '.$_POST['Field1'].'\r\n'.'email: '.$_POST['Field3'].'\r\n'.'Mensaje: '.$_POST['Field4'].'\r\n';
		$cabeceras = 'Reply-To: '.$_POST['Field3']."\r\n".
		'X-Mailer: PHP/' . phpversion();
		mail($para, $titulo, $mensaje, $cabeceras);
		echo "<div style='text-align:center;'><h1>Gracias!!!</h1> <p>pronto estaremos en contacto d(^_^o)!!</p></div>";
	} else {
		header('Location: http://phirequiem.github.io/DevWeb');
	}
?>