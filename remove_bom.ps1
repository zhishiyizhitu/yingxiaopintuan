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
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        # Check for BOM (EF BB BF)
        if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            $newBytes = New-Object byte[] ($bytes.Length - 3)
            [System.Array]::Copy($bytes, 3, $newBytes, 0, $bytes.Length - 3)
            [System.IO.File]::WriteAllBytes($fullPath, $newBytes)
            Write-Host "Removed BOM from: $file"
        }
    } else {
        Write-Host "File not found: $fullPath"
    }
}

Write-Host "BOM removal completed!"
