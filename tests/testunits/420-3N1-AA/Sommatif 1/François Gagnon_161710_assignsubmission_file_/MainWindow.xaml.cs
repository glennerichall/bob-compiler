/* Résultat: 18.5/20 */
/* Très bien!
 *
 * Code bien indenté,
 * Opérations fonctionnelles.
 *
 * Attention!
 *
 * Using inutiles.
 * Espaces en trop entre les instructions (ligne 47).
 * Manque d'espaces entre les instructions (ligne 68).
 * Noms représentatifs des variables (ligne 137).
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Drawing.Text;

namespace GAGF28109908_Somma_1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            //color picker initializer
            clrPick.SelectedColor = Color.FromRgb(0, 0, 0);

            var fonts = new InstalledFontCollection();
            foreach (var family in fonts.Families)
            {
                LsbPolices.Items.Add(


                    new ListBoxItem
                    {
                        Content = family.Name,
                        FontFamily = new FontFamily(family.Name)
                    }

                );
            }

            for (int i = 8; i < 13; i++)
            {
                appendLBItem(i);
            }
            for (int i = 14; i <= 28; i += 2)
            {
                appendLBItem(i);
            }
            appendLBItem(36);
            appendLBItem(48);
            appendLBItem(74);
            LsbPolices.SelectedIndex = 0;
            LsbStyle.SelectedIndex = 0;
            LsbTaille.SelectedIndex = 2;

            TxbStyle.Width = LsbStyle.Width;
            TxbPolice.Width = LsbPolices.Width;
            TxbTaille.Width = TxbTaille.Width;


        }

        private void appendLBItem(int content)
        {
            if (content == 1)
            {
                LsbTaille.Items.Add(
                    new ListBoxItem
                    {
                        Content = content,
                        IsSelected = true
                    }
                );
            }
            else
            {
                LsbTaille.Items.Add(
                    new ListBoxItem
                    {
                        Content = content
                    }
                );
            }
        }

        private void LsbPolices_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = (string)((ListBoxItem)LsbPolices.SelectedItem).Content;
            TxbPolice.Text = famille;
            txbRender.Text = famille;

        }
        private void LsbStyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = (string)((ListBoxItem)LsbStyle.SelectedItem).Content;
            TxbStyle.Text = famille;
            switch (famille)
            {
                case "Normal":
                    txbRender.FontStyle = FontStyles.Normal;
                    txbRender.FontWeight = FontWeights.Normal;
                    break;
                case "Italique":
                    txbRender.FontStyle = FontStyles.Italic;
                    txbRender.FontWeight = FontWeights.Normal;
                    break;
                case "Gras":
                    txbRender.FontStyle = FontStyles.Normal;
                    txbRender.FontWeight = FontWeights.Bold;
                    break;
                case "Gras Italique":
                    txbRender.FontStyle = FontStyles.Italic;
                    txbRender.FontWeight = FontWeights.Bold;
                    break;

            }

        }
        private void LsbTaille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = ((ListBoxItem)LsbTaille.SelectedItem).Content.ToString();

            TxbTaille.Text = famille;//Question, plante, ne veut ass convertir
        }

        private void CbbPolice_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (txbRender != null)
            {
                txbRender.TextDecorations = ((TextBlock)((ComboBoxItem)cbbPolice.SelectedItem).Content).TextDecorations;
            }

        }

        private void ClrPick_OnSelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            txbRender.Foreground = new SolidColorBrush((Color)clrPick.SelectedColor);
        }
    }
}
