/* Résultat: 16.5/20 */
﻿using System;
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

namespace RICK76100099_Som1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            CpkText.SelectedColor = Color.FromRgb(0, 0, 0);

            var fonts = new InstalledFontCollection();

            var premiereIteration = true;
            foreach (var family in fonts.Families)
            {
                if (premiereIteration)
                {
                    LsbPolice.Items.Add(
                        new ListBoxItem
                        {
                            Content = family.Name,
                            FontFamily = new FontFamily(family.Name),
                            IsSelected = true
                        }
                    );
                    premiereIteration = false;
                }
                else
                {
                    LsbPolice.Items.Add(
                        new ListBoxItem
                        {
                            Content = family.Name,
                            FontFamily = new FontFamily(family.Name)
                        }
                     );
                }

            }
        }

        private void LsbPolice_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            TebAprecu.Text = (String)((ListBoxItem)LsbPolice.SelectedItem).Content;
            TebAprecu.FontFamily = ((ListBoxItem)LsbPolice.SelectedItem).FontFamily;
        }

        private void ListBoxItem_Selected(object sender, RoutedEventArgs e)
        {
            if (TebAprecu == null) return;
            switch (LsbStyle.SelectedIndex)
            {
                case 0:
                    TebAprecu.FontStyle = FontStyles.Normal;
                    TebAprecu.FontWeight = FontWeights.Normal;
                    break;
                case 1:
                    TebAprecu.FontStyle = FontStyles.Italic;
                    TebAprecu.FontWeight = FontWeights.Normal;
                    break;
                case 2:
                    TebAprecu.FontWeight = FontWeights.Bold;
                    TebAprecu.FontStyle = FontStyles.Normal;
                    break;
                case 3:
                    TebAprecu.FontStyle = FontStyles.Italic;
                    TebAprecu.FontWeight = FontWeights.Bold;
                    break;
                default:
                    break;
            }
            
        }

        private void LsbTaille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (TebAprecu == null) return;
            TebAprecu.FontSize = Int32.Parse((String)((ListBoxItem)LsbTaille.SelectedItem).Content);
        }

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            
            switch (CobUnderline.SelectedIndex)
            {
                /* Err: (12) Il manque la gestion pour le soulignement Normal, (1 point) */
                case 1:
                    TebAprecu.TextDecorations = Underline.TextDecorations;
                    break;
                case 2:
                    TebAprecu.TextDecorations = UnderlineBold.TextDecorations;
                    break;
                case 3:
                    TebAprecu.TextDecorations = UnderlineDash.TextDecorations;
                    break;
                default:
                    break;
            }
        }

        private void CpkText_SelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            TebAprecu.Foreground = new SolidColorBrush((Color)CpkText.SelectedColor);
        }
    }
}
