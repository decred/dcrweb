document.onload = ajaxGet(null,"ghcommits","https://api.github.com/repos/decred/dcrd/stats/commit_activity");

function ajaxGet(param,container,page){
	var xmlhttp;

	if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}else{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
					
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){
			var jsonResult = JSON.parse(xmlhttp.responseText);
			var commits = 0;
			
			for(var j in jsonResult){
				commits += jsonResult[j]['total'];
				console.log(commits);
			}
			
			document.getElementById(container).innerHTML=commits;
		}
	}
					
	xmlhttp.open("GET",page,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(null);
}
