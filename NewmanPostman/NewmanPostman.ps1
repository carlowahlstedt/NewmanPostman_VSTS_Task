[CmdletBinding()]
param()

Write-Host "Starting NewmanPostman"

$environment = Get-VstsInput -Name "environment";
$sslClientCert = Get-VstsInput -Name "sslClientCert";
$sslClientKey = Get-VstsInput -Name "sslClientKey";
$reporterHtmlTemplate = Get-VstsInput -Name "reporterHtmlTemplate";
$reporters = Get-VstsInput -Name "reporters";
$collectionFileSource = Get-VstsInput -Name "collectionFileSource";

Trace-VstsEnteringInvocation $MyInvocation
try {
    Write-Host "executing newman"
    newman run $collectionFileSource -e $environment --ssl-client-cert $sslClientCert --ssl-client-key $sslClientKey --reporter-html-template $reporterHtmlTemplate -r $reporters
}
catch {
    Write-Warning "There was a problem with the script. Look above for the issues"
    throw $_.Exception
}
finally {
    Trace-VstsLeavingInvocation $MyInvocation
}

Write-Host "Ending NewmanPostman"