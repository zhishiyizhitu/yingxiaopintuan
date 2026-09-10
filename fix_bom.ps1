$files = @(
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/SettlementMarketPayOrderRequestDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/NotifyRequestDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/RefundMarketPayOrderRequestDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/GoodsMarketRequestDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/GoodsMarketResponseDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/IMarketTradeService.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/IDCCService.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/response/Response.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/SettlementMarketPayOrderResponseDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/dto/LockMarketPayOrderResponseDTO.java",
    "group-buy-market-mine/group-buy-market-api/src/main/java/cn/bugstack/api/IMarketIndexService.java"
)

foreach ($file in $files) {
    $fullPath = Join-Path "e:\javastudy\group-buy-market-all" $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        if ($content -match '^ackage') {
            $content = $content -replace '^ackage', 'package'
            Set-Content -Path $fullPath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Fixed: $file"
        }
    } else {
        Write-Host "File not found: $fullPath"
    }
}

Write-Host "Done!"
