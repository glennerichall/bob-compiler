/* Résultat: 12/20 */
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

namespace Sommatif_1
{
    /// <summary>
    /// Logique d'interaction pour MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            colorList.SelectedColor = Color.FromRgb(0, 0, 0);

            var fonts = new InstalledFontCollection();

            foreach(var family in fonts.Families)
            {
                list.Items.Add(new ListBoxItem {
                    Content = family.Name,
                    FontFamily = new FontFamily(family.Name)
                });
            }

        }

        private void List_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var famille = (string)((ListBoxItem)list.SelectedItem).Content;
            apercu.Text = famille;
            apercu.FontFamily = new FontFamily(famille);
            familles.Text = famille;
        }

        private void ColorList_OnSelectedColorChanged(object sender, RoutedPropertyChangedEventArgs<Color?> e)
        {
            apercu.Foreground = new SolidColorBrush((Color)colorList.SelectedColor);
        }

        private void Taille_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var taille =((ListBoxItem) size.SelectedItem).Content;
            apercu.FontSize = Convert.ToDouble (taille);
            police.Text = (string) taille;
        }

        private void Style_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var style = (string)((ListBoxItem)font.SelectedItem).Content;

            styles.Text = style;

            if (style == "Gras")
            {
                apercu.FontWeight = FontWeights.Bold;
                apercu.FontStyle = FontStyles.Normal;
            }
            /* Err: (15) Instruction inadéquate, (0.5 point) */
            if (style == "Italique")
            {
                apercu.FontWeight = FontWeights.Normal;
                apercu.FontStyle = FontStyles.Italic;
            }
            if (style == "Gras Italique")
            {
                apercu.FontWeight = FontWeights.Bold;
                apercu.FontStyle = FontStyles.Italic;
            }
            if (style == "Normal")
            {
                apercu.FontWeight = FontWeights.Normal;
                apercu.FontStyle = FontStyles.Normal;
            }


        }

        
    }
}
