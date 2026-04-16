# How to View Your Website

## Option 1: Open HTML Files Directly (Simplest)

Simply double-click these files to open them in your default browser:

1. **Home Page:**  
   `\\tnas\Storage\Vibe Code\Royal Visa Xpert\index.html`

2. **Visa Catalog:**  
   `\\tnas\Storage\Vibe Code\Royal Visa Xpert\visas.html`

3. **Contact Page:**  
   `\\tnas\Storage\Vibe Code\Royal Visa Xpert\contact.html`

4. **About Page:**  
   `\\tnas\Storage\Vibe Code\Royal Visa Xpert\about.html`

**Note:** Some features like the contact form submission will work, but you'll get the best experience with a local server.

---

## Option 2: Use Live Server (VS Code Extension)

If you have Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Your browser will open at `http://127.0.0.1:5500`

---

## Option 3: Fix the PowerShell Server

The simple_server.ps1 had a port conflict. Try these steps:

1. **Check what's using port 8085:**
   ```powershell
   netstat -ano | findstr :8085
   ```

2. **Kill the process (if needed):**
   ```powershell
   taskkill /PID <process_id> /F
   ```

3. **Run the server again:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File ".\simple_server.ps1"
   ```

4. **Open browser to:**
   http://localhost:8085/

---

## Option 4: Use a Different Port

Edit `simple_server.ps1` and change line 3 from:
```powershell
$listener.Prefixes.Add("http://localhost:8085/")
```

To a different port like:
```powershell
$listener.Prefixes.Add("http://localhost:3000/")
```

Then run the server and visit: http://localhost:3000/

---

## Recommended: Option 1 (Direct File Opening)

For quick testing, just navigate to:
```
\\tnas\Storage\Vibe Code\Royal Visa Xpert\
```

And double-click `index.html` to open it in your browser!

All features will work except:
- Web3Forms will redirect properly
- Images will load
- JavaScript will function
- Styling will apply

The only limitation is that you'll see `file:///` in the URL instead of `http://localhost`.
