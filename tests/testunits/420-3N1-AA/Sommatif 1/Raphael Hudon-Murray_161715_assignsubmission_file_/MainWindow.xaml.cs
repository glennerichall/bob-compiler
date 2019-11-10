/* Résultat: 19/20 */
using System;
using System.Collections.Generic;
using System.Drawing.Text;
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

namespace sommatif_1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
           
            clrpick.SelectedColor = Color.FromRgb(0, 0, 0);
            var fonts = new InstalledFontCollection();

            foreach (var family in fonts.Families)
            {
                Lsbpolice.Items.Add(
                    new ListBoxItem
                    {
                        Content = family.Name,
                        FontFamily = new FontFamily(family.Name)
                    }
                );
            }
        }
        bool initial = true;
        private void Lsbpolice_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            txtpolice.Text = (String) ((ListBoxItem)Lsbpolice.SelectedItem).Content;
            apercu.Text = (String)((ListBoxItem)Lsbpolice.SelectedItem).Content;
            apercu.FontFamily = new FontFamily((String)((ListBoxItem)Lsbpolice.SelectedItem).Content);
        }

        private void Lsbstyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            txtstyle.Text = (String) ((ListBoxItem)lsbstyle.SelectedItem).Content;
            String style = (String)((ListBoxItem)lsbstyle.SelectedItem).Content;
            if(style == "Normal") {
                apercu.FontStyle = FontStyles.Normal;
                apercu.FontWeight = FontWeights.Normal;
            }
            else if(style == "Italique"){
                apercu.FontStyle = FontStyles.Italic;
                apercu.FontWeight = FontWeights.Normal;
            }
            else if(style == "Gras") {
                apercu.FontWeight = FontWeights.Bold;
                apercu.FontStyle = FontStyles.Normal;
            }
            else if(style == "Gras Italique") {
                apercu.FontStyle = FontStyles.Italic;
                apercu.FontWeight = FontWeights.Bold;
            }
        }

        private void Lsbtaille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            txtTaille.Text = (String)((ListBoxItem)lsbtaille.SelectedItem).Content;
            apercu.FontSize = Int32.Parse((String)((ListBoxItem)lsbtaille.SelectedItem).Content);
        }

        private void Clrpick_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            apercu.Foreground = new SolidColorBrush((Color)clrpick.SelectedColor);
        }

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var souligner = (String)((ComboBoxItem)cmbsoulign.SelectedItem).Name;
            if(souligner == "aucun")
            {
                if(initial == false)
                {
                    apercu.TextDecorations = ((TextBlock)((ComboBoxItem)cmbsoulign.SelectedItem).Content).TextDecorations;
                }
                else
                {
                    initial = false;
                }
                
            }
            else if(souligner == "souligner1")
            {
                apercu.TextDecorations = TextDecorations.Underline;
            }
            else if (souligner == "souligner2")
            {
                apercu.TextDecorations = txtblc2.TextDecorations;
            }
            else if (souligner == "souligner3")
            {
                apercu.TextDecorations = txtblc3.TextDecorations;
            }

        }
    }
}
