$body = @{
    type = "fire"
    description = "Test fire incident at Connaught Place"
    peopleAffected = 10
    lat = 28.6315
    lng = 77.2167
    address = "Connaught Place, New Delhi"
} | ConvertTo-Json

Write-Host "Submitting test report..."
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/reports/public' -Method Post -ContentType 'application/json' -Body $body
    Write-Host "Success!"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_"
    Write-Host $_.Exception.Response
}
