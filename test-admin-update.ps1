# Teste de atualização de produto via PowerShell
Write-Host "Fazendo login admin..." -ForegroundColor Yellow

# 1. Login admin
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.data.token
    Write-Host "Login admin bem-sucedido" -ForegroundColor Green
    
    # 2. Obter produtos
    Write-Host "Obtendo lista de produtos..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $productsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method GET -Headers $headers
    $products = $productsResponse.data
    Write-Host "$($products.Count) produtos encontrados" -ForegroundColor Green
    
    if ($products.Count -eq 0) {
        Write-Host "Nenhum produto disponivel para teste" -ForegroundColor Red
        return
    }
    
    # 3. Pegar primeiro produto
    $testProduct = $products[0]
    Write-Host "Produto para teste: ID=$($testProduct.id), Title=$($testProduct.title)" -ForegroundColor Cyan
    
    # 4. Preparar dados de atualização
    $updateData = @{
        title = "$($testProduct.title) (Atualizado)"
        price = $testProduct.price
        originalPrice = $testProduct.originalPrice
        imageUrl = if ($testProduct.imageUrl) { $testProduct.imageUrl } else { "" }
        affiliateUrl = if ($testProduct.affiliateUrl) { $testProduct.affiliateUrl } else { "" }
        storeId = $testProduct.storeId
        description = if ($testProduct.description) { $testProduct.description } else { "Descricao de teste atualizada" }
        rating = $testProduct.rating
        reviewCount = $testProduct.reviewCount
        soldCount = $testProduct.soldCount
        freeShipping = $testProduct.freeShipping
        warranty = $testProduct.warranty
        categoryIds = @()
    }
    
    if ($testProduct.categories) {
        $updateData.categoryIds = $testProduct.categories | ForEach-Object { $_.category.id }
    }
    
    Write-Host "Tentando atualizar produto..." -ForegroundColor Yellow
    Write-Host "Dados: $($updateData | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
    
    # 5. Fazer update
    $updateBody = $updateData | ConvertTo-Json -Depth 3
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products/$($testProduct.id)" -Method PUT -ContentType "application/json" -Headers $headers -Body $updateBody
    
    Write-Host "Produto atualizado com sucesso!" -ForegroundColor Green
    Write-Host "Resultado: $($updateResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Detalhes do erro: $errorBody" -ForegroundColor Red
    }
}