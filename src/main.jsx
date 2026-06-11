import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import { UploadCloud, Download, Search, RefreshCw, X, CheckCircle2, AlertTriangle, FileSpreadsheet, ChevronDown, Users, Settings, BarChart3, CreditCard, Bell, Menu, Plus, Eye } from 'lucide-react';
import './styles.css';

const users = [
  {name:'张明明', id:'412************231X', phone:'156****0725', time:'2026-05-21 14:25', status:'已签约'},
  {name:'付秋霖', id:'410************8867', phone:'186****9693', time:'2026-02-11 09:42', status:'已签约'},
  {name:'刘晓雯', id:'320************4521', phone:'138****7751', time:'2026-04-18 16:09', status:'已签约'},
  {name:'陈立', id:'510************2190', phone:'139****3012', time:'2026-03-08 11:30', status:'已签约'},
];
const successRows = [
  ['1','赵六','4101**********663X','138****1111','成功','能才科技签约模板'],
  ['2','钱七','4101**********345X','139****2222','成功','能才科技签约模板'],
  ['3','孙八','4101**********432X','137****6789','成功','能才科技签约模板'],
];
const failRows = [
  ['1','张三','4101**********663X','失败','该人员未完成签约'],
  ['2','李四','4101**********345X','失败','签约模板不匹配'],
  ['3','王五','4101**********432X','失败','该人员已在本企业列表中'],
  ['4','周九','4101**********122X','失败','姓名与身份证号不匹配'],
];

function Button({children,type='default',icon,onClick,disabled}){return <button disabled={disabled} onClick={onClick} className={'el-btn '+(type==='primary'?'el-btn-primary ':'')+(type==='plain'?'el-btn-plain ':'')}>{icon}{children}</button>}
function Tag({children,type='success'}){return <span className={'el-tag '+type}>{children}</span>}
function Input({placeholder}){return <div className="el-input"><input placeholder={placeholder}/></div>}
function Select({label}){return <div className="el-select"><span>{label}</span><ChevronDown size={15}/></div>}
function Modal({title,children,onClose,width='680px'}){return <div className="mask"><div className="dialog" style={{width}}><div className="dialog-head"><h3>{title}</h3><button onClick={onClose} className="icon-btn"><X size={18}/></button></div>{children}</div></div>}

function BatchModal({onClose,onResult}){
 const [file,setFile]=useState(false); const [err,setErr]=useState('');
 const upload=()=>{ if(!file){setErr('请先选择或拖拽上传 xlsx 文件');return;} onResult('partial') };
 return <Modal title="批量添加已签约人员" onClose={onClose}>
   <div className="dialog-body">
    <div className="template-card"><div><span className="muted">当前企业签约模板</span><strong>能才科技签约模板</strong></div><Tag>已启用</Tag></div>
    <div className="notice">仅支持添加【已签约】且【签约模板匹配】的人员；姓名、身份证号必填，手机号选填。</div>
    <div className="form-row"><label>下载模板</label><Button icon={<Download size={16}/>} type="plain">下载 Excel 模板</Button></div>
    <div className="form-row vertical"><label>上传文件</label><div className={'upload '+(file?'uploaded':'')} onClick={()=>{setFile(true);setErr('')}}><UploadCloud size={36}/><p>{file?'contractor_import_202606.xlsx':'点击或拖拽文件到此区域'}</p><span>只支持 xlsx 格式，最大 10MB，单次最多 500 条</span></div>{err&&<div className="error-text">{err}</div>}</div>
   </div>
   <div className="dialog-foot"><Button onClick={onClose}>取消</Button><Button type="primary" onClick={upload}>确认上传</Button></div>
  </Modal>
}
function ResultModal({mode,onClose,onDetail}){ const ok=mode==='success'; return <Modal title="上传结果" onClose={onClose} width="560px"><div className="result-box">{ok?<CheckCircle2 className="result-icon success" size={68}/>:<AlertTriangle className="result-icon warning" size={68}/>}<h2>{ok?'批量添加成功':'批量添加完成'}</h2><p>{ok?'已成功添加 35 人':'成功：25人    失败：10人    已存在：5人'}</p><div className="result-actions"><Button onClick={onClose}>{ok?'返回':'关闭'}</Button><Button type="primary" onClick={onDetail} icon={<Eye size={16}/>}>查看详情</Button></div></div></Modal>}
function DetailModal({onClose}){ const [tab,setTab]=useState('fail'); const rows=tab==='fail'?failRows:successRows; return <Modal title="添加详情" onClose={onClose} width="920px"><div className="dialog-body"><div className="summary"><div><b>25</b><span>成功人数</span></div><div><b>10</b><span>失败人数</span></div><div><b>5</b><span>已存在</span></div></div><div className="tabs"><button className={tab==='fail'?'active':''} onClick={()=>setTab('fail')}>失败明细</button><button className={tab==='success'?'active':''} onClick={()=>setTab('success')}>成功明细</button></div><div className="table-title">{tab==='fail'?'失败明细（共10人）':'成功明细（共25人）'}</div><table className="data-table"><thead><tr>{tab==='fail'?['序号','姓名','身份证号','状态','失败原因'].map(h=><th key={h}>{h}</th>):['序号','姓名','身份证号','手机号','状态','签约模板'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{j===3&&tab==='fail'?<Tag type="danger">{c}</Tag>:j===4&&tab==='success'?<Tag>{c}</Tag>:c}</td>)}</tr>)}</tbody></table></div><div className="dialog-foot"><Button type="primary" onClick={onClose}>关闭</Button></div></Modal>}

function App(){ const [batch,setBatch]=useState(false),[result,setResult]=useState(null),[detail,setDetail]=useState(false); return <div className="app"><aside><div className="brand"><div className="logo">N</div><span>能才零工平台</span></div><nav><a className="active"><Users size={18}/>用户管理</a><a><CreditCard size={18}/>项目发放</a><a><BarChart3 size={18}/>数据统计</a><a><Settings size={18}/>系统设置</a></nav></aside><main><header><div className="left"><Menu size={22}/><div><h1>用户管理</h1><p>管理企业已签约零工人员，支持批量添加与后续项目发放</p></div></div><div className="right"><Bell size={20}/><div className="avatar">胡</div></div></header><section className="panel"><div className="toolbar"><div><Button type="primary" icon={<Plus size={16}/>} onClick={()=>setBatch(true)}>批量添加</Button><Button icon={<Download size={16}/>}>导出</Button></div><div className="hint"><FileSpreadsheet size={16}/> 当前签约模板：能才科技签约模板</div></div><div className="filter"><div><label>签约状态</label><Select label="全部"/></div><div><label>姓名/手机号</label><Input placeholder="请输入姓名、手机号"/></div><Button type="primary" icon={<Search size={16}/>}>搜索</Button><Button icon={<RefreshCw size={16}/>}>重置</Button></div><table className="data-table main-table"><thead><tr><th>用户姓名</th><th>证件号码</th><th>预签约手机号</th><th>签约时间</th><th>签约状态</th><th>操作</th></tr></thead><tbody>{users.map(u=><tr key={u.name}><td><div className="user-cell"><div className="mini-avatar">{u.name[0]}</div>{u.name}</div></td><td>{u.id}</td><td>{u.phone}</td><td>{u.time}</td><td><Tag>{u.status}</Tag></td><td><a className="link">查看</a></td></tr>)}</tbody></table><div className="pagination"><span>共 128 条</span><button>上一页</button><button className="current">1</button><button>2</button><button>3</button><button>下一页</button></div></section></main>{batch&&<BatchModal onClose={()=>setBatch(false)} onResult={(m)=>{setBatch(false);setResult(m)}}/>}{result&&<ResultModal mode={result} onClose={()=>setResult(null)} onDetail={()=>{setResult(null);setDetail(true)}}/>}{detail&&<DetailModal onClose={()=>setDetail(false)}/>}</div>}

createRoot(document.getElementById('root')).render(<App/>);
