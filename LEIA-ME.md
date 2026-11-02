# Meu Painel

App pessoal para iPhone (site instalável): corrida com GPS, academia, corpo, agenda, gastos, contas parceladas, leitura e notícias.

- **Endereço:** https://aroberto90.github.io/meu-painel/
- **Instalar:** abrir no Safari › Compartilhar › Adicionar à Tela de Início.
- **Dados:** ficam só no celular (IndexedDB). Cópia de segurança em Mais › Ajustes › Salvar cópia (iCloud Drive).
- **Notícias:** o GitHub Actions roda `ferramentas/noticias.js` de hora em hora e publica `noticias.json` junto do app.
- **Publicar mudança:** commit + push na `main` (o workflow `Publicar` monta e publica no GitHub Pages).
- Lembretes de contas e compromissos vão para o Calendário do iPhone (arquivo .ics), porque app instalado pelo Safari não avisa sozinho.
