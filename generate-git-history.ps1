# EmergenX - Git History Generator
# WARNING: For educational and demonstration purposes only
# This script simulates a realistic development workflow for the EmergenX project

# Configuration
$repoPath = "$(Get-Location)"
$startDate = [DateTime]::Parse("2025-01-01")  # January 1, 2025
$endDate = [DateTime]::Parse("2025-06-04")    # June 4, 2025

# Project-specific configuration
$projectName = "EmergenX"
$authorName = "PandiHarshan"
$authorEmail = "kit27.am35@gmail.com"

# Safety check
if (-not (Test-Path ".git")) {
    Write-Host "Initializing new Git repository..." -ForegroundColor Yellow
    git init
}

# Set Git user configuration
git config user.name "$authorName"
git config user.email "$authorEmail"

# Project structure
$serverFiles = @(
    "Server/controllers/patientController.js",
    "Server/controllers/authController.js",
    "Server/controllers/triageController.js",
    "Server/models/Patient.js",
    "Server/models/User.js",
    "Server/models/Triage.js",
    "Server/routes/patientRoutes.js",
    "Server/routes/authRoutes.js",
    "Server/config/db.js",
    "Server/.env.example",
    "Server/index.js"
)

$clientFiles = @(
    "client/src/components/Header.jsx",
    "client/src/components/PatientForm.jsx",
    "client/src/components/TriageResult.jsx",
    "client/src/pages/Login.jsx",
    "client/src/pages/Dashboard.jsx",
    "client/src/pages/PatientList.jsx",
    "client/src/context/AuthContext.jsx",
    "client/src/services/api.js",
    "client/src/App.jsx",
    "client/src/index.js"
)

# Create project files if they don't exist
function Initialize-ProjectFiles {
    foreach ($file in ($serverFiles + $clientFiles)) {
        $dir = Split-Path $file -Parent
        if ($dir -ne "") {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
        }
        if (-not (Test-Path $file)) {
            "// Auto-generated file for $projectName" | Out-File -FilePath $file -Encoding utf8
        }
    }
}

# Function to get realistic commit messages for EmergenX
function Get-EmergenXCommitMessage {
    $types = @("feat", "fix", "refactor", "docs", "test", "chore", "perf", "style")
    $components = @("auth", "triage", "patient", "ui", "api", "database", "socket", "validation")
    $actions = @("add", "update", "fix", "improve", "optimize", "refactor", "implement", "enhance")
    $nouns = @("authentication", "triage system", "patient form", "dashboard", "API endpoints", "database schema", "UI components", "error handling")
    
    $type = $types | Get-Random
    $component = $components | Get-Random
    $action = $actions | Get-Random
    $noun = $nouns | Get-Random
    
    # Common commit message patterns
    $templates = @(
        "${type}(${component}): $action $noun",
        "${type}(${component}): $action $component $noun",
        "${type}: $action $component $noun",
        "${type}(${component}): $action $noun in $component"
    )
    
    $message = $templates | Get-Random
    
    # Add some variety with issue references (20% chance)
    if ((Get-Random -Minimum 1 -Maximum 100) -le 20) {
        $issueNum = Get-Random -Minimum 1 -Maximum 50
        $message += " (fixes #$issueNum)"
    }
    
    return $message
}

# Function to modify a file with realistic changes
function Update-ProjectFile($filePath) {
    $fileContent = if (Test-Path $filePath) { Get-Content $filePath -Raw } else { "" }
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Different update patterns based on file type
    $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
    
    switch ($extension) {
        ".js" {
            $newContent = "// Updated: $timestamp - $((Get-EmergenXCommitMessage).Replace("`n", " "))`n$fileContent"
        }
        ".jsx" {
            $newContent = "// Updated: $timestamp - $((Get-EmergenXCommitMessage).Replace("`n", " "))`n$fileContent"
        }
        ".json" {
            try {
                $json = $fileContent | ConvertFrom-Json -ErrorAction Stop
                $json | Add-Member -Name "_lastUpdated" -Value $timestamp -MemberType NoteProperty -Force
                $newContent = $json | ConvertTo-Json -Depth 10
            }
            catch {
                $newContent = $fileContent
            }
        }
        default {
            $newContent = "# Updated: $timestamp - $((Get-EmergenXCommitMessage).Replace("`n", " "))`n$fileContent"
        }
    }
    
    $newContent | Out-File -FilePath $filePath -Encoding utf8 -Force
}

# Initialize project files if needed
Initialize-ProjectFiles

# Generate commits
$currentDate = $startDate
$commitCount = 0

Write-Host "`n=== $projectName - Git History Generator ===" -ForegroundColor Cyan
Write-Host "Generating commit history from $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))`n" -ForegroundColor Cyan
Write-Host "WARNING: This script is for educational purposes only!`n" -ForegroundColor Yellow

while ($currentDate -le $endDate) {
    # Skip weekends (80% of the time) and some weekdays (20% of the time)
    $skipDay = $false
    $rand = Get-Random -Minimum 1 -Maximum 100
    
    # Weekends are less likely to have commits
    if ($currentDate.DayOfWeek -in @([System.DayOfWeek]::Saturday, [System.DayOfWeek]::Sunday)) {
        $skipDay = $rand -le 80  # 80% chance to skip weekends
    }
    # Randomly skip some weekdays (20% chance)
    elseif ($rand -le 20) {
        $skipDay = $true
    }

    if (-not $skipDay) {
        # Vary the number of commits per day (0-4) with different probabilities
        $commitsToday = switch (Get-Random -Minimum 1 -Maximum 100) {
            {$_ -le 40} { 1 }      # 40% chance for 1 commit
            {$_ -le 70} { 2 }      # 30% chance for 2 commits
            {$_ -le 90} { 3 }      # 20% chance for 3 commits
            default { 4 }          # 10% chance for 4 commits
        }
        
        for ($i = 0; $i -lt $commitsToday; $i++) {
            # Distribute commits during working hours (9 AM - 6 PM)
            $hour = 9 + (Get-Random -Minimum 0 -Maximum 9)
            $minute = Get-Random -Minimum 0 -Maximum 60
            $second = Get-Random -Minimum 0 -Maximum 60
            
            $commitDate = [DateTime]::new(
                $currentDate.Year,
                $currentDate.Month,
                $currentDate.Day,
                $hour, $minute, $second
            )
            
            $commitMessage = Get-EmergenXCommitMessage
            
            # Select files to modify (1-3 files per commit)
            $filesToUpdate = @()
            $numFiles = Get-Random -Minimum 1 -Maximum 4
            $allFiles = $serverFiles + $clientFiles | Get-Random -Count $numFiles
            foreach ($file in $allFiles) {
                if (Test-Path $file) {
                    $filesToUpdate += $file
                }
            }
            
            # Update files
            foreach ($file in $filesToUpdate) {
                Update-ProjectFile -filePath $file
                git add $file
            }
            
            # Skip if no files were staged
            $stagedFiles = git diff --cached --name-only
            if (-not $stagedFiles) {
                Write-Host "No changes to commit, skipping..." -ForegroundColor Yellow
                continue
            }
            
            # Create commit with specific date
            $utcDate = $commitDate.ToUniversalTime()
            $gitDate = $utcDate.ToString("yyyy-MM-dd HH:mm:ss")
            $env:GIT_AUTHOR_DATE = $gitDate
            $env:GIT_COMMITTER_DATE = $gitDate
            
            git commit -m "$commitMessage" --date="$gitDate +0000" --quiet
            
            $commitCount++
            Write-Host "[$($commitDate.ToString('yyyy-MM-dd HH:mm'))] $commitMessage" -ForegroundColor Green
            
            # Show progress every 10 commits
            if (($commitCount % 10) -eq 0) {
                $daysPassed = ($currentDate - $startDate).Days
                $totalDays = ($endDate - $startDate).Days
                $progress = [math]::Min(100, [math]::Round(($daysPassed / $totalDays) * 100))
                Write-Progress -Activity "Generating commit history" -Status "$progress% Complete" -PercentComplete $progress
            }
        }
    }
    
    $currentDate = $currentDate.AddDays(1)
}

# Clean up environment variables
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

# Show summary
Write-Host "`n=== Commit Generation Complete ===" -ForegroundColor Green
Write-Host "Total commits created: $commitCount" -ForegroundColor Cyan
Write-Host "Date range: $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))" -ForegroundColor Cyan
Write-Host "`nIMPORTANT: This script was for educational purposes only." -ForegroundColor Yellow
Write-Host "In a real project, always create meaningful commits that reflect actual work." -ForegroundColor Yellow

# Show next steps
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review the generated commit history with: git log --oneline" -ForegroundColor White
Write-Host "2. To push to a remote repository:" -ForegroundColor White
Write-Host "   git remote add origin <repository-url>" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "`nNote: Use force push (-f) with caution as it rewrites history." -ForegroundColor Red
Write-Host "`nMake sure your Git email matches your GitHub email:" -ForegroundColor Yellow
Write-Host "   git config user.email" -ForegroundColor Gray
Write-Host "`nIf it doesn't match, update it with:" -ForegroundColor Yellow
Write-Host "   git config --global user.email \"your-github-email@example.com\"" -ForegroundColor Gray
