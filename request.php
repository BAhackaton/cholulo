<?php
$fecha = $_GET['fecha'];
if (!$fecha){
	$fecha = date('d/m/Y');
}
$ch = curl_init('http://elastic.restopengov.org/gcba/set-filmaciones/_search');
curl_setopt ($ch, CURLOPT_POST, 1);
$opt = '{
"Fecha de Rodaje" : '.$fecha.'
}';
curl_setopt ($ch, CURLOPT_POSTFIELDS, $opt);
$respuesta = curl_exec ($ch);
curl_close ($ch);
echo $respuesta;
?>