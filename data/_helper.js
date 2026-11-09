// Helper compartilhado para montar os bancos de palavras a partir de linhas compactas.
// Formato de cada linha:
// [palavra_pt, palavra_en, subcategoria, dica1_pt, dica2_pt, dica3_pt, dica1_en, dica2_en, dica3_en]
window.WORD_BANK = window.WORD_BANK || {};

window.buildTheme = function (rows) {
  return rows.map(function (r) {
    return {
      subcategory: r[2],
      word: { pt: r[0], en: r[1] },
      hints: {
        pt: [r[3], r[4], r[5]],
        en: [r[6], r[7], r[8]]
      }
    };
  });
};
