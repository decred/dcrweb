<?php

$GLOBALS["clearcache"] = 0;
$GLOBALS["debug"] = 0;

if ($GLOBALS["clearcache"]) {
    apcu_clear_cache();
}

$spdata = array(
    "Bravo" => array(
        //"launchedEpoch" => strtotime("Sun May 22 17:54:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcr.stakepool.net",
    ),
    "Charlie" => array(
        //"launchedEpoch" => strtotime("Sat Jul 23 17:11:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://decredstakepool.com"
    ),
    "Delta" => array(
        //"launchedEpoch" => strtotime("Thu May 19 10:19:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcr.stakeminer.com",
    ),
    "Echo" => array(
        //"launchedEpoch" => strtotime("Mon May 23 12:59:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "http://pool.d3c.red",
    ),
    "Foxtrot" => array(
        //"launchedEpoch" => strtotime("Tue May 31 08:23:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://dcrstakes.com",
    ),
    "Golf" => array(
        //"launchedEpoch" => strtotime("Wed May 25 04:09:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://stakepool.dcrstats.com",
    ),
    "Hotel" => array(
        //"launchedEpoch" => strtotime("Sat May 28 14:31:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "https://stake.decredbrasil.com",
    ),
    "India" => array(
        //"launchedEpoch" => strtotime("Sun May 22 13:58:00 CDT 2016"),
        "lastAttempt" => 0,
        "lastUpdated" => 0,
        "url" => "http://stakepool.eu",
    ),
    "Juliett" => array(
        //"launchedEpoch" => strtotime("Sun Jun 12 15:52:00 CDT 2016"),
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
// downloads image cache
case "dic":
    header("Content-type: image/svg+xml");
    $svg = downloadsImageCache();
    print $svg;
    break;
// get insight status
case "gis":
    $status = getInsightStatus();
    print $status;
    break;
// get stakepool data
case "gsd":
    getStakepoolData($spdata);
    $allpooldata = array();
    foreach (array_keys($spdata) as $i) {
        $allpooldata[$i] = apcu_fetch("spcache-{$i}");
    }
    array_shuffle($allpooldata);
    print json_encode($allpooldata);
    break;
}

function array_shuffle(&$array) {
    $keys = array_keys($array);

    shuffle($keys);

    foreach($keys as $key) {
        $new[$key] = $array[$key];
    }

    $array = $new;

    return true;
}

function debugLog($s) {
    if ($GLOBALS["debug"]) {
        error_log($s);
    }
}

function downloadsFetchURL($url) {
    $timeOut = 5;
    $c = curl_init($url);
    curl_setopt($c, CURLOPT_USERAGENT, "decred/dcrweb bot");
    curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_TIMEOUT, $timeOut);
    $r = curl_exec($c);
    if ($r === false) {
        error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$url}");
    }
    curl_close($c);

    return $r;
}

function downloadsGetCount() {
    $decred_binaries = downloadsFetchURL("https://api.github.com/repos/decred/decred-binaries/releases");
    $decred_release = downloadsFetchURL("https://api.github.com/repos/decred/decred-release/releases");

    if (!json_decode($decred_binaries, true)) {
        error_log("decred_binaries was not valid JSON: '{$decred_binaries}'");
        exit;
    }

    if (!json_decode($decred_release, true)) {
        error_log("decred_release was not valid JSON: '{$decred_release}'");
        exit;
    }

    $dataset = array(
        "db" => json_decode($decred_binaries, true),
        "dr" => json_decode($decred_release, true),
    );

    $count = 0;

    foreach (array_values($dataset) as $data) {
        foreach (array_values($data) as $release) {
            foreach (array_values($release) as $stats) {
                if (is_array($stats)) {
                    foreach ($stats as $id => $keys) {
                        if (is_array($keys)) {
                            $file = "";
                            foreach ($keys as $k => $v) {
                                if ($k == "name") {
                                    $file = $v;
                                }
                                if ($k == "download_count") {
                                    //print "$file => $v\n";
                                    $count = $count + $v;
                                }
                            }
                        }
                    }
                }
            }
        }
        //error_log("count $count");
    }

    return $count;
}

// XXX will need adjusting when integer count reaches 6 digits
function downloadsImageCache() {
    $cacheTTL = 4 * 60 * 60;
    $svgTemplate = '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><mask id="a"><rect width="128" height="20" rx="3" fill="#fff"/></mask><g mask="url(#a)"><path fill="#555" d="M0 0h69v20H0z"/><path fill="#4c1" d="M69 0h59v20H69z"/><path fill="url(#b)" d="M0 0h128v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="34.5" y="15" fill="#010101" fill-opacity=".3">downloads</text><text x="34.5" y="14">downloads</text><text x="97.5" y="15" fill="#010101" fill-opacity=".3">__COUNT__ total</text><text x="97.5" y="14">__COUNT__ total</text></g></svg>';

    $curSVG = apcu_fetch("downloadsSVG");
    if (empty($curSVG)) {
        $count = downloadsGetCount();
        if (!$count) {
            error_log("downloadsGetCount returned '{$count}'");
            exit;
        }
        $countString = round($count / 1000) . "k";

        $newSVG = str_replace("__COUNT__", $countString, $svgTemplate);
        apcu_store("downloadsSVG", $newSVG, $cacheTTL);
        return $newSVG;
    } else {
        return $curSVG;
    }
}

function getInsightStatus() {
    $cacheTTL = 60;
    $timeOut = 2;
    $status = '{"info":{"blocks":"-"}}';
    $url = "https://mainnet.decred.org/api/status";

    $curStatus = apcu_fetch("gsi");

    if (empty($curStatus)) {
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_USERAGENT, "decred/dcrweb bot");
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
        curl_close($c);
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
            curl_setopt($c, CURLOPT_USERAGENT, "decred/dcrweb bot");
            curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            // XXX if getstakeinfo isn't cached then this takes a long time
            // XXX should probably be parallelized
            curl_setopt($c, CURLOPT_TIMEOUT, $timeOut*3);
            $r = curl_exec($c);
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
                    "ProportionLive" => "",
                    "UserCount" => "",
                );
                foreach (array_keys($nd) as $k) {
                    if (preg_match("/\<span id=\"{$k}\".*?\>(.*?)\<\/span\>/m", $r, $m)) {
                        $nd[$k] = $m[1];
                    }
                }
                foreach ($nd as $k => $v) {
                    if ($v == "") {
                        $nd[$k] = "N/A";
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
            curl_close($c);
        } else {
            debugLog("no updates required for {$i}");
        }
    }
}

?>