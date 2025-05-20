const CharactersSave = require('../../models/Characters-Save'); // موديل اختيار الشخصية

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'choose_character_select') return;

    const selectedValue = interaction.values[0]; // على سبيل المثال: "character_1"
    const characterNumber = selectedValue.split('_')[1];

    // البحث عما إذا كان المستخدم قد اختار بالفعل هذه الشخصية
    let userSelection = await CharactersSave.findOne({ userId: interaction.user.id });
    if (userSelection && userSelection.selectedCharacter === characterNumber) {
      // إلغاء الاختيار إذا كان محدد من قبل
      await CharactersSave.deleteOne({ userId: interaction.user.id });
      await interaction.reply({ content: `Character ${characterNumber} selection has been removed successfully.`, ephemeral: true });
    } else {
      // تحديث أو إنشاء سجل اختيار للشخصية
      if (userSelection) {
        userSelection.selectedCharacter = characterNumber;
        await userSelection.save();
      } else {
        const newSelection = new CharactersSave({
          userId: interaction.user.id,
          selectedCharacter: characterNumber
        });
        await newSelection.save();
      }
      await interaction.reply({ content: `Character ${characterNumber} has been selected successfully.`, ephemeral: true });
    }
  }
};
