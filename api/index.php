<?php

$GLOBALS["clearcache"] = 0;
$GLOBALS["debug"] = 0;

define("STAKEPOOL_API_INITIAL_VERSION", 1);
define("STAKEPOOL_API_CURRENT_VERSION", 2);

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
        "Network" => "mainnet",
        "URL" => "https://dcr.stakepool.net",
    ),
    "Delta" => array(
        //"LaunchedEpoch" => strtotime("Thu May 19 10:19:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://dcr.stakeminer.com",
    ),
    "Echo" => array(
        //"LaunchedEpoch" => strtotime("Mon May 23 12:59:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://pool.d3c.red",
    ),
    "Foxtrot" => array(
        //"LaunchedEpoch" => strtotime("Tue May 31 08:23:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://dcrstakes.com",
    ),
    "Golf" => array(
        //"LaunchedEpoch" => strtotime("Wed May 25 04:09:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://stakepool.dcrstats.com",
    ),
    "Hotel" => array(
        //"LaunchedEpoch" => strtotime("Sat May 28 14:31:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://stake.decredbrasil.com",
    ),
    "India" => array(
        //"LaunchedEpoch" => strtotime("Sun May 22 13:58:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://stakepool.eu",
    ),
    "Juliett" => array(
        //"LaunchedEpoch" => strtotime("Sun Jun 12 15:52:00 CDT 2016"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://dcr.ubiqsmart.com",
    ),
    "Kilo" => array(
        //"LaunchedEpoch" => strtotime("Tue Feb  7 17:00:00 CDT 2017"),
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "testnet",
        "URL" => "https://teststakepool.decred.org",
    ),
    "Lima" => array(
        "APIEnabled" => false,
        "APIVersionsSupported" => array(),
        "LastAttempt" => 0,
        "LastUpdated" => 0,
        "Network" => "mainnet",
        "URL" => "https://ultrapool.eu",
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
case "dc":
    header("Content-Type: application/json");
    $count = downloadsCount();
    print json_encode(array("DownloadsCount", $count), JSON_NUMERIC_CHECK);
    break;
// downloads image cache
case "dic":
    header("Content-Type: image/svg+xml");
    $svg = downloadsImageCache();
    print $svg;
    break;
// get coin supply
case "gcs":
    header("Content-Type: application/json");
    $gscData = getCoinSupply();
    print json_encode($gscData, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT);
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
        $pooldata = apcu_fetch("spcache-{$i}");
        // skip dcrstakes until they upgrade to the current API
        if ($pooldata["URL"] == "https://dcrstakes.com" && !in_array(STAKEPOOL_API_CURRENT_VERSION, $pooldata["APIVersionsSupported"])) {
            continue;
        }
        $allpooldata[$i] = $pooldata;
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

function downloadsCount() {
    $cacheTTL = 4 * 60 * 60;

    // use the cached value if it is present
    $cachedDownloadsCount = apcu_fetch("downloadsCount");
    if (!empty($cachedDownloadsCount)) {
        return $cachedDownloadsCount;
    }

    // get a new value and cache it if it's good
    $newDownloadsCount = downloadsGetCount();
    if ($newDownloadsCount > 0) {
        $countString = round($newDownloadsCount / 1000) . "k";
        apcu_store("downloadsCount", $countString, $cacheTTL);
    }

    // return a default count from just before 0.8.0 if no cache
    // and couldn't get a new good count
    if (!$count) {
        return "61k";
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

function getCoinSupply() {
    $cacheTTL = 60;
    $timeOut = 3;
    $URL = "https://mainnet.decred.org/api/status?q=getCoinSupply";

    $curCoinSupply = apcu_fetch("gsc");
    if (empty($curCoinSupply)) {
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
                apcu_store("gsc", $jd["coinsupply"], $cacheTTL);
                $curCoinSupply = $jd["coinsupply"];
            } else {
                $curCoinSupply = "464594945383704";
            }
        }
        curl_close($c);
    }

    $airdrop = $premine = 840000;
    $coinSupplyAvailable = round($curCoinSupply / 100000000);
    $coinSupplyAfterBlock1 = $coinSupplyAvailable - $airdrop - $premine;
    $coinSupplyTotal = 21000000;

    $data = array(
        "PercentMined" => round($coinSupplyAvailable/$coinSupplyTotal*100, 1, PHP_ROUND_HALF_UP),
        "CoinSupplyMined" => $coinSupplyAvailable,
        "CoinSupplyMinedRaw" => $curCoinSupply,
        "CoinSupplyTotal" => $coinSupplyTotal,
        "Airdrop" => round($airdrop/$coinSupplyAvailable*100, 1, PHP_ROUND_HALF_UP),
        "Pos" => round($coinSupplyAfterBlock1*30/100/$coinSupplyAvailable*100, 1, PHP_ROUND_HALF_UP),
        "Pow" => round($coinSupplyAfterBlock1*60/100/$coinSupplyAvailable*100, 1, PHP_ROUND_HALF_UP),
        "Premine" => round($premine/$coinSupplyAvailable*100, 1, PHP_ROUND_HALF_UP),
        "Subsidy" => round($coinSupplyAfterBlock1*10/100/$coinSupplyAvailable*100, 1, PHP_ROUND_HALF_UP),
    );

    return $data;
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

function getStakepoolStatsAPI($poolURL, $timeOut, $fields, $apiversion) {
    $empty = array();

    $apiURL = "$poolURL/api/v${apiversion}/stats";

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

function getStakepoolData($spdata) {
    $fields = array(
            "Immature",
            "Live",
            "Voted",
            "Missed",
            "PoolFees",
            "ProportionLive",
            "UserCount",
            "UserCountActive",
    );

    $fieldtypes = array(
            "Immature" => "int",
            "Live" => "int",
            "Voted" => "int",
            "Missed" => "int",
            "PoolFees" => "float",
            "ProportionLive" => "float",
            "UserCount" => "int",
            "UserCountActive" => "int",
    );

    $interval = 20 * 60;
    $timeOut = 2;
    
    foreach (array_keys($spdata) as $i) {
        $cachedData = apcu_fetch("spcache-{$i}");
        $stats = array();

        if (isset($cachedData["LastUpdated"])
            && time() - $cachedData["LastUpdated"] > $interval
            && time() - $cachedData["LastAttempt"] > $interval) {

            // if a pool's URL changed then we need to force usage of it
            if ($cachedData["URL"] != $spdata[$i]["URL"]) {
                $cachedData["URL"] = $spdata[$i]["URL"];
            }

            debugLog("updating {$cachedData["URL"]}");
            $cachedData["LastAttempt"] = time();

            // need to force these keys into existence for upgrades but we don't
            // want to overwrite a cached true value
            if (!isset($cachedData["APIEnabled"])) {
                $cachedData["APIEnabled"] = false;
            }

            if (!isset($cachedData["APIVersionsSupported"])) {
                $cachedData["APIVersionsSupported"] = 0;
            }

            if (!isset($cachedData["Network"])) {
                $cachedData["Network"] = $spdata[$i]["Network"];
            }

            // first try current API version
            list ($timedOut, $stats) = getStakepoolStatsAPI($cachedData["URL"], $timeOut, $fields, STAKEPOOL_API_CURRENT_VERSION);

            // if current API version worked then note that
            if (!empty($stats)) {
                debugLog("got stats via APIv" . STAKEPOOL_API_CURRENT_VERSION . " from {$cachedData["URL"]}");
                $cachedData["APIEnabled"] = true;
                $cachedData["APIVersionsSupported"] = array(
                    STAKEPOOL_API_INITIAL_VERSION,
                    STAKEPOOL_API_CURRENT_VERSION
                );
            }

            // fall back to old API version but only if we didn't timeout
            if (empty($stats)) {
                if (!$timedOut) {
                    list ($timedOut, $stats) = getStakepoolStatsAPI($cachedData["URL"], $timeOut, $fields, 1);
                    // if API v1 worked then note that
                    if (!$timedOut && !empty($stats)) {
                        debugLog("got stats via APIv " . STAKEPOOL_API_INITIAL_VERSION . " from {$cachedData["URL"]}");
                        $cachedData["APIEnabled"] = true;
                        $cachedData["APIVersionsSupported"] = array(
                            STAKEPOOL_API_INITIAL_VERSION
                        );
                    }
                }
            }

            // update the LastAttempt and continue on failure
            if (empty($stats)) {
                debugLog("no stats available from {$cachedData["URL"]}");
                apcu_store("spcache-{$i}", $cachedData);
                continue;
            }

            foreach ($stats as $k => $v) {
                if ($v === "") {
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
