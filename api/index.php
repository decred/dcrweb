<?php

$GLOBALS["clearcache"] = 0;
$GLOBALS["debug"] = 0;

if ($GLOBALS["clearcache"]) {
    apcu_clear_cache();
}

$spdata = array(
    "Bravo" => array(
        //"LaunchedEpoch" => strtotime("Sun May 22 17:54:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://dcr.stakepool.net",
    ),
    "Charlie" => array(
        //"LaunchedEpoch" => strtotime("Sat Jul 23 17:11:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://decredstakepool.com"
    ),
    "Delta" => array(
        //"LaunchedEpoch" => strtotime("Thu May 19 10:19:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://dcr.stakeminer.com",
    ),
    "Echo" => array(
        //"LaunchedEpoch" => strtotime("Mon May 23 12:59:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "http://pool.d3c.red",
    ),
    "Foxtrot" => array(
        //"LaunchedEpoch" => strtotime("Tue May 31 08:23:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://dcrstakes.com",
    ),
    "Golf" => array(
        //"LaunchedEpoch" => strtotime("Wed May 25 04:09:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://stakepool.dcrstats.com",
    ),
    "Hotel" => array(
        //"LaunchedEpoch" => strtotime("Sat May 28 14:31:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "https://stake.decredbrasil.com",
    ),
    "India" => array(
        //"LaunchedEpoch" => strtotime("Sun May 22 13:58:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "http://stakepool.eu",
    ),
    "Juliett" => array(
        //"LaunchedEpoch" => strtotime("Sun Jun 12 15:52:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "URL" => "http://dcrstakepool.getjumbucks.com",
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
    header("Content-Type: application/json");
    $status = getInsightStatus();
    print $status;
    break;
// get stakepool data
case "gsd":
    header("Content-Type: application/json");
    getStakepoolData($spdata);
    $allpooldata = array();
    foreach (array_keys($spdata) as $i) {
        $allpooldata[$i] = apcu_fetch("spcache-{$i}");
    }
    array_shuffle($allpooldata);
    print json_encode($allpooldata, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT);
    break;
default:
    print "unknown command";
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

function downloadsFetchURL($URL) {
    $timeOut = 5;
    $c = curl_init($URL);
    curl_setopt($c, CURLOPT_USERAGENT, "decred/dcrweb bot");
    curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_TIMEOUT, $timeOut);
    $r = curl_exec($c);
    if ($r === false) {
        error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$URL}");
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
        debugLog("count $count");
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
    $timeOut = 3;
    $status = '{"info":{"blocks":"-"}}';
    $URL = "https://mainnet.decred.org/api/status";

    $curStatus = apcu_fetch("gsi");

    if (empty($curStatus)) {
        $c = curl_init($URL);
        curl_setopt($c, CURLOPT_USERAGENT, "decred/dcrweb bot");
        curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($c, CURLOPT_TIMEOUT, $timeOut);
        $r = curl_exec($c);
        if ($r === false) {
            error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping {$URL}");
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

function getStakepoolStatsAPI($poolURL, $timeOut, $fields) {
    $empty = array();

    $apiURL = "$poolURL/api/v1/stats";

    debugLog("GET $apiURL");
    $c = curl_init($apiURL);
    curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
    // XXX if getstakeinfo isn't cached then this takes a long time
    // XXX should probably be parallelized
    curl_setopt($c, CURLOPT_TIMEOUT, $timeOut*3);
    $r = curl_exec($c);
    if ($r === false) {
        error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping $apiURL");
        // XXX should probably check to see if the curl error code shows a timeout occurred
        return array(1, $empty);
    }

    $httpCode = curl_getinfo($c, CURLINFO_HTTP_CODE);
    curl_close($c);

    // pools that haven't implemented this yet will likely 404 or possibly
    // redirect to an error page.
    if ($httpCode != 200) {
        debugLog("HTTP status code was $httpCode");
        return array(0, $empty);
    }

    $json = json_decode($r, true);
    if ($json === false) {
        debugLog("failed to parse $json");
        return array(0, $empty);
    } else {
        if ($json["status"] == "success") {
            foreach ($fields as $field) {
                if (!isset($json["data"][$field])) {
                    debugLog("missing field $field in response");
                    return array(0, $empty);
                }
            }
            return array(0, $json["data"]);
        } else if ($json["status"] == "error") {
            debugLog("API error: {$json["message"]}");
            return array(0, $empty);
        } else {
            debugLog("improper json response $r");
            return array(0 , $empty);
        }
    }
}

function getStakepoolStatsHTML($poolURL, $timeOut, $fields, $fieldtypes) {
    $empty = array();

    $htmlURL = "$poolURL/stats";

    debugLog("GET $htmlURL");
    $c = curl_init($htmlURL);
    curl_setopt($c, CURLOPT_CONNECTTIMEOUT, $timeOut);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
    // XXX if getstakeinfo isn't cached then this takes a long time
    // XXX should probably be parallelized
    curl_setopt($c, CURLOPT_TIMEOUT, $timeOut*3);
    $r = curl_exec($c);
    if ($r === false) {
        error_log("curl error: " . curl_error($c) . " (errno: " . curl_errno($c)  . ") while scraping $htmlURL");
        curl_close($c);
        return $empty;
    } else {
        curl_close($c);
        $stats = array();
        foreach ($fields as $field) {
            if (preg_match("/\<span id=\"{$field}\".*?\>(.*?)\<\/span\>/m", $r, $m)) {
                if (stristr($m[1], "%")) {
                    $m[1] = str_replace("%", "", $m[1]);
                }

                $fieldtype = $fieldtypes[$field];
                switch ($fieldtype) {
                case "float":
                    $stats["field"] = floatval($m[1]);
                case "int":
                    $stats[$field] = intval($m[1]);
                default:
                    $stats[$field] = strval($m[1]);
                }
            }
        }

        return $stats;
    }
}

function getStakepoolData($spdata) {
    $fields = array(
            "Immature",
            "Live",
            "Voted",
            "Missed",
            "PoolFees",
            "ProportionLive",
            "UserCount"
    );

    $fieldtypes = array(
            "Immature" => "int",
            "Live" => "int",
            "Voted" => "int",
            "Missed" => "int",
            "PoolFees" => "float",
            "ProportionLive" => "float",
            "UserCount" => "int",
    );

    $interval = 20 * 60;
    $timeOut = 2;
    
    foreach (array_keys($spdata) as $i) {
        $cachedData = apcu_fetch("spcache-{$i}");
        $stats = array();

        if (isset($cachedData["LastUpdated"])
            && time() - $cachedData["LastUpdated"] > $interval
            && time() - $cachedData["LastAttempt"] > $interval) {

            debugLog("updating {$cachedData["URL"]}");
            $cachedData["LastAttempt"] = time();

            // need to force these keys into existence for upgrades but we don't
            // want to overwrite a cached true value
            if (!isset($d["APIEnabled"])) {
                $d["APIEnabled"] = false;
            }

            if (!isset($d["APIVersionsSupported"])) {
                $d["APIVersionsSupported"] = 0;
            }

            // first try the API
            list ($timedOut, $stats) = getStakepoolStatsAPI($cachedData["URL"], $timeOut, $fields);

            // if the API worked then note that
            if (!empty($stats)) {
                debugLog("got stats via API from {$cachedData["URL"]}");
                $cachedData["APIEnabled"] = true;
                // FIXME need to detect versions if there's ever more than v1
                $cachedData["APIVersionsSupported"] = array(1);
            }

            if (empty($stats)) {
                // fall back to HTML but only if we didn't timeout
                if (!$timedOut) {
                    debugLog("trying stats via HTML from {$cachedData["URL"]}");
                    $stats = getStakepoolStatsHTML($cachedData["URL"], $timeOut, $fields, $fieldtypes);
                } else {
                    debugLog("timed out getting stats via API from {$cachedData["URL"]}");
                }
            }

            // update the LastAttempt and continue on failure
            if (empty($stats)) {
                debugLog("no stats available from {$cachedData["URL"]}");
                apcu_store("spcache-{$i}", $cachedData);
                continue;
            }

            foreach ($stats as $k => $v) {
                if ($v == "") {
                    $stats[$k] = -1;
                }
            }

            $cachedData["LastUpdated"] = time();
            foreach ($fields as $field) {
                // don't cache failed reads
                if (array_key_exists($field, $cachedData) && $cachedData[$field] != -1 && $stats[$field] == -1) {
                    debugLog("skipping caching empty value for $field");
                    continue;
                }

                if (isset($stats[$field])) {
                    $cachedData[$field] = $stats[$field];
                }
            }

            apcu_store("spcache-{$i}", $cachedData);

            debugLog("successfully updated {$cachedData["URL"]}");
        } else {
            debugLog("no updates required for {$cachedData["URL"]}");
        }
    }
}
?>
