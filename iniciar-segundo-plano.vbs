' Inicia a aplicacao Curioso em segundo plano de forma 100% invisivel
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c npm run start", 0, False
Set WshShell = Nothing
