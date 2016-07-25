<?php

$GLOBALS["clearcache"] = 0;
$GLOBALS["debug"] = 0;

if ($GLOBALS["clearcache"]) {
    apcu_clear_cache();
}

$spdata = array(
    "Bravo" => array(
        "launchedEpoch" => strtotime("Sun May 22 17:54:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcr.stakepool.net",
    ),
    "Charlie" => array(
        "launchedEpoch" => strtotime("SAt Jul 23 17:11:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://decredstakepool.com"
    ),
    "Delta" => array(
        "launchedEpoch" => strtotime("Thu May 19 10:19:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcr.stakeminer.com",
    ),
    "Echo" => array(
        "launchedEpoch" => strtotime("Mon May 23 12:59:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "http://pool.d3c.red",
    ),
    "Foxtrot" => array(
        "launchedEpoch" => strtotime("Tue May 31 08:23:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcrstakes.com",
    ),
    "Golf" => array(
        "launchedEpoch" => strtotime("Wed May 25 04:09:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://stakepool.dcrstats.com",
    ),
    "Hotel" => array(
        "launchedEpoch" => strtotime("Sat May 28 14:31:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://stake.decredbrasil.com",
    ),
    "India" => array(
        "launchedEpoch" => strtotime("Sun May 22 13:58:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "http://stakepool.eu",
    ),
    "Juliett" => array(
        "launchedEpoch" => strtotime("Sun Jun 12 15:52:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "http://dcrstakepool.getjumbucks.com",
    )
);

foreach ($spdata as $i => $d) {
    apcu_add("spcache-{$i}", $d);
}

switch ($_REQUEST["c"]) {
// clear cache
case "cc":
    if ($_SERVER["REMOTE_ADDR"] == "127.0.0.1" || $_SERVER["REMOTE_ADDR"] == "::1") {
        apcu_clear_cache();
        print "cache cleared\n";
    } else {
        print "unauthorized\n";
    }
    break;
// get insight status;
case "gis":
    $status = getInsightStatus();
    print $status;
    break;
// get downloads image
case "gdi":
    header("Content-type: image/png");
    $png = getDownloadsImage();
    print $png;
    break;
// get stakepool data
case "gsd":
    getStakepoolData($spdata);
    $allpooldata = array();
    foreach (array_keys($spdata) as $i) {
        $allpooldata[$i] = apcu_fetch("spcache-{$i}");
    }
    print json_encode($allpooldata);
    break;
}

function debugLog($s) {
    if ($GLOBALS["debug"]) {
        error_log($s);
    }
}

function getDownloadsImage() {
    $cacheTTL = 24 * 60 * 60;
    $timeOut = 3;
    $png = file_get_contents("../content/images/total.png");
    $url = "https://img.shields.io/github/downloads/decred/decred-release/total.png";

    $curPng = apcu_fetch("gdi");
    if (empty($curPng)) {
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($c, CURLOPT_TIMEOUT, $timeOut);
        $r = curl_exec($c);
        if ($r === false) {
            error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$url}");
        } else {
            // XXX PHP image validation functions seem to require a file
            if (!empty($r)) {
                apcu_store("gdi", $r, $cacheTTL);
            }
            $png = $r;
        }
    } else {
        $png = $curPng;
    }
    
    return $png;
}

function getInsightStatus() {
    $cacheTTL = 60;
    $timeOut = 1;
    $status = '{"info":{"blocks":"-"}}';
    $url = "https://mainnet.decred.org/api/status";

    $curStatus = apcu_fetch("gsi");

    if (empty($curStatus)) {
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($c, CURLOPT_TIMEOUT, $timeOut);
        $r = curl_exec($c);
        if ($r === false) {
            error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$url}");
        } else {
            $jd = json_decode($r, true);
            if (!empty($jd)) {
                apcu_store("gsi", $r, $cacheTTL);
            }
            $status = $r;
        }
    } else {
        $status = $curStatus;
    }

    return $status;
}

function getStakepoolData($spdata) {
    $interval = 20 * 60;
    $timeOut = 2;
    
    foreach (array_keys($spdata) as $i) {
        $d = apcu_fetch("spcache-{$i}");
        if (isset($d["lastUpdated"]) && time() - $d["lastUpdated"] > $interval && time() - $d["lastAttempt"] > $interval) {
            debugLog("updating $i: {$d["url"]}");
            $d["lastAttempt"] = time();
            $c = curl_init("{$d["url"]}/stats");
            curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            // XXX if getstakeinfo isn't cached then this takes a long time
            // XXX should probably be parallelized
            curl_setopt($c, CURLOPT_TIMEOUT, $timeOut*3);
            $r = curl_exec($c);
            curl_close($c);
            if ($r === false) {
                apcu_store("spcache-{$i}", $d);
                error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$d["url"]}/stats");
            } else {
                $nd = array(
                    "Immature" => "",
                    "Live" => "",
                    "Voted" => "",
                    "Missed" => "",
                    "PoolFees" => "",
                    "UserCount" => "",
                    "PoolStatus" => "",
                );
                foreach (array_keys($nd) as $k) {
                    if (preg_match("/\<span id=\"{$k}\"\>(.*?)\<\/span\>/m", $r, $m)) {
                        $nd[$k] = $m[1];
                    }
                }
                foreach ($nd as $k => $v) {
                    if ($v == "") {
                        $nd[$k] = "N/A";
                        $nd["PoolStatus"] = "Unknown";
                    }
                }
                foreach ($nd as $k => $v) {
                    // don't cache failed reads
                    if (array_key_exists($k, $d) && $d[$k] != "N/A" && $v == "N/A") {
                        continue;
                    }
                    $d[$k] = $v;
                }
                $d["lastAttempt"] = time();
                $d["lastUpdated"] = time();
                apcu_store("spcache-{$i}", $d);
                debugLog("updated $i");
            }
        } else {
            debugLog("no updates required for {$i}");
        }
    }
}

?>