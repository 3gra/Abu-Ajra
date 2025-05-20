const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const CharactersCreated = require('../../models/Characters-Created'); // موديل الشخصيات المقبولة

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // التأكد من أن التفاعل هو زر وبمعرّف open_choose_character
    if (!interaction.isButton() || interaction.customId !== 'open_choose_character') return;

    // جلب الشخصيات الخاصة بالمستخدم من قاعدة البيانات
    let userCharacters = await CharactersCreated.find({ userId: interaction.user.id });
    if (!userCharacters || userCharacters.length === 0) {
      await interaction.reply({ content: 'You do not have any approved characters.', ephemeral: true });
      return;
    }

    // بناء خيارات القائمة بناءً على الشخصيات المحفوظة
    const options = userCharacters.map(char => ({
      label: `Character ${char.characterNumber}`,
      description: `Select Character ${char.characterNumber}`,
      value: `character_${char.characterNumber}`
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('choose_character_select')
      .setPlaceholder('Select your character')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ content: 'Select your character:', ephemeral: true, components: [row] });
  }
};
