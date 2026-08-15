import {
  Building2, ShoppingCart, Home, Briefcase, Code, Brain, RefreshCw, Settings,
  Search, ClipboardList, Palette, Bug, Rocket, LifeBuoy, Sparkles, Smartphone,
  Zap, ShieldCheck, TrendingUp, Wrench, Users, CheckCircle, Headphones, Star,
  Globe, Server, Database, Lock, Mail, Phone, MessageCircle, MapPin, Instagram,
  Linkedin, Github, Youtube, Facebook, Twitter, ArrowRight, ArrowLeft, Plus,
  Edit, Trash2, Eye, X, Menu, Check, ChevronDown, ChevronRight, ChevronLeft,
  ExternalLink, Image, Upload, Download, LogOut, Bell, User, Loader2, Save,
  EyeOff, Copy, Layers, Cpu, Cloud, Gauge, Code2, Boxes, Award, Target,
  Lightbulb, Heart, ThumbsUp, Send, Quote, ArrowUpRight, Calendar, Building,
  CircleDollarSign, BarChart3, LayoutDashboard, FolderKanban, Inbox, FileText,
  DollarSign, Tag, Clock, Filter, AlertCircle, FileEdit,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Building2, ShoppingCart, Home, Briefcase, Code, Brain, RefreshCw, Settings,
  Search, ClipboardList, Palette, Bug, Rocket, LifeBuoy, Sparkles, Smartphone,
  Zap, ShieldCheck, TrendingUp, Wrench, Users, CheckCircle, Headphones, Star,
  Globe, Server, Database, Lock, Mail, Phone, MessageCircle, MapPin, Instagram,
  Linkedin, Github, Youtube, Facebook, Twitter, ArrowRight, ArrowLeft, Plus,
  Edit, Trash2, Eye, X, Menu, Check, ChevronDown, ChevronRight, ChevronLeft,
  ExternalLink, Image, Upload, Download, LogOut, Bell, User, Loader2, Save,
  EyeOff, Copy, Layers, Cpu, Cloud, Gauge, Code2, Boxes, Award, Target,
  Lightbulb, Heart, ThumbsUp, Send, Quote, ArrowUpRight, Calendar, Building,
  CircleDollarSign, BarChart3, LayoutDashboard, FolderKanban, Inbox, FileText,
  DollarSign, Tag, Clock, Filter, AlertCircle, FileEdit,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Code;
}
