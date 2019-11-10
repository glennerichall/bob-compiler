/* Résultat: 19.5/20 */
* Résultat: -21.5/20 */
using System;
using System.Drawing;
using System.Drawing.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Color = System.Windows.Media.Color;
using FontFamily = System.Windows.Media.FontFamily;

namespace WpfApp1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            InstalledFontCollection fonts = new InstalledFontCollection();

            foreach (System.Drawing.FontFamily fontsFamily in fonts.Families)
            {
                LsbPolices.Items.Add(
                    new ListBoxItem()
                    {
                        Content = fontsFamily.Name,
                        FontFamily = new FontFamily(fontsFamily.Name)
                    }
                );
            }

            CpPolice.SelectedColor = Color.FromRgb(0, 0, 0);
        }

        private void LsbPolices_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = (String)((ListBoxItem)LsbPolices.SelectedItem).Content;
            TbxPolice.Text = famille;
            TxtApercu.Text = famille;
            TxtApercu.FontFamily = new FontFamily(famille);
        }

        private void LsbStyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TxtApercu != null)
            {
                switch (LsbStyle.SelectedIndex)
                {
                    case 0:
                        // --ITALIQUE --GRAS  NORMAL
                        TxtApercu.FontStyle = FontStyles.Normal;
                        TxtApercu.FontWeight = FontWeights.Normal;
                        TbxStyle.Text = "Normal";
                        break;
                    case 1:
                        // ++ITALIQUE --GRAS
                        TxtApercu.FontStyle = FontStyles.Italic;
                        TxtApercu.FontWeight = FontWeights.Normal;
                        TbxStyle.Text = "Italique";
                        break;
                    case 2:
                        // ++GRAS --ITALIQUE
                        TxtApercu.FontWeight = FontWeights.Bold;
                        TxtApercu.FontStyle = FontStyles.Normal;
                        TbxStyle.Text = "Gras";
                        break;
                    case 3:
                        // ++GRAS ++ITALIQUE
                        TxtApercu.FontStyle = FontStyles.Italic;
                        TxtApercu.FontWeight = FontWeights.Bold;
                        TbxStyle.Text = "Gras italique";
                        break;
                }
            }
        }

        private void LsbTaille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            int taille = 10;
            if (LsbTaille != null)
            {
                var tailleContent = (String)((ListBoxItem)LsbTaille.SelectedItem).Content;
                taille = int.Parse(tailleContent);
            }

            if (TxtApercu != null)
                TxtApercu.FontSize = taille;

            TbxTaille.Text = Convert.ToString(taille);
        }

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (CmbSoulignement != null && TxtApercu != null)
            {
                switch (CmbSoulignement.SelectedIndex)
                {
                    case 0:
                        TxtApercu.TextDecorations = new TextDecorationCollection();
                        break;
                    case 1:
                        TxtApercu.TextDecorations = SouligneLeger.TextDecorations;
                        break;
                    case 2:
                        TxtApercu.TextDecorations = SouligneGras.TextDecorations;
                        break;
                    case 3:
                        TxtApercu.TextDecorations = SoulignePointille.TextDecorations;
                        break;
                }
            }
        }

        private void CpPolice_OnSelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            if (CpPolice.SelectedColor != null)
            {
                Color color = (Color)CpPolice.SelectedColor;
                SolidColorBrush brush = new SolidColorBrush(color);

                TxtApercu.Foreground = brush;
            }
        }
    }
}
