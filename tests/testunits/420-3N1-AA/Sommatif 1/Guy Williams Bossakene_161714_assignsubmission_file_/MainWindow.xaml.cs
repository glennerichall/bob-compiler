/* Résultat: 17/20 */
/* Très bien!
 *
 * Code bien indenté,
 * Opérations fonctionnelles.
 *
 * Attention!
 *
 * Namespace du projet (TS????).
 */

/*Nom : Guy Willilams Bossakene
 *Code permanent : BOSG13078605
 * date :10/10/2019
 * But : Gérer les évènements de la fenêtre xaml
 */
using System.Drawing.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace TS1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        public MainWindow()
        {
            InitializeComponent();

            InitialiserPolices();

            InitialiserStyle();

            SelectionnerTaille(x: 2);

            InitialiserCouleur();

        }

        // Cette fonction permet d'appliquer la couleur selectionné à l'aperçu
        private void ClrPicker_OnSelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            if (ClrPicker.SelectedColor != null) TxtApercu.Foreground = new SolidColorBrush(color: (Color)ClrPicker.SelectedColor);
        }

        // Cette fonction permet d'appliquer le soulignement à l'aperçu
        private void CmbSouligne_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TxtApercu != null) TxtApercu.TextDecorations = CmbSouligne.SelectedIndex == 0 ? new TextDecorationCollection() : ((TextBlock)((ComboBoxItem)CmbSouligne.SelectedItem).Content).TextDecorations;
        }

        // Cette fonction permet d'appliquer le style à l'aperçu
        private void LsbStyles_OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var style = LsbStyles.SelectedIndex;
            switch (style)
            {
                case 0:
                    TxtApercu.FontStyle = FontStyles.Normal;
                    TxtApercu.FontWeight = FontWeights.Normal;
                    break;
                case 1:
                    TxtApercu.FontStyle = FontStyles.Italic;
                    TxtApercu.FontWeight = FontWeights.Normal;
                    break;
                case 2:
                    TxtApercu.FontWeight = FontWeights.Bold;
                    TxtApercu.FontStyle = FontStyles.Normal;
                    break;
                case 3:
                    TxtApercu.FontStyle = FontStyles.Italic;
                    TxtApercu.FontWeight = FontWeights.Bold;
                    break;
            }

        }

        private void InitialiserPolices()
        {
            // Cette boucle ajoute le contenu de la listBox Police
            var fonts = new InstalledFontCollection();
            foreach (var family in fonts.Families)
            {
                LsbFonts.Items.Add(
                    newItem: new ListBoxItem
                    {
                        Content = family.Name,
                        FontFamily = new FontFamily(familyName: family.Name)
                    }
                );
            }

            LsbFonts.SelectedIndex = 0;
        }

        private void InitialiserStyle()
        {
            // Cette boucle ajoute le contenu de la listBox contenant le style de la police
            string styles = "Normal,Italique,Gras,Gras Italique";
            foreach (var style in styles.Split(','))
            {
                LsbStyles.Items.Add(
                    newItem: new ListBoxItem
                    {
                        Content = style
                    }
                );
            }

            LsbStyles.SelectedIndex = 0;
        }

        // Selectionner la taille par défaut
        private void SelectionnerTaille(int x)
        {
            LsbTaille.SelectedIndex = x;
            LsbTaille.ScrollIntoView(item: LsbTaille.Items[index: LsbTaille.SelectedIndex]);
        }

        private void InitialiserCouleur()
        {
            // Ajouter Une couleur initiale
            ClrPicker.SelectedColor = Color.FromRgb(r: 0, g: 0, b: 0);
        }
    }
}
