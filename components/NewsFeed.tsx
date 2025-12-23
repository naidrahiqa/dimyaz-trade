import { ExternalLink } from 'lucide-react';
import React from 'react';

interface NewsItem {
    id: string;
    title: string;
    body: string;
    url: string;
    imageurl: string;
    source: string;
}

interface NewsFeedProps {
    news: NewsItem[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
    return (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Latest Crypto News</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {news && news.length > 0 ? news.map((item) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                        <div className="flex gap-4">
                            <img
                                src={item.imageurl}
                                alt="News"
                                className="w-16 h-16 object-cover rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div>
                                <h4 className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">{item.source}</span>
                                    <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </a>
                )) : (
                    <div className="text-gray-500 text-sm text-center py-4">Loading news data...</div>
                )}
            </div>
        </div>
    );
};
